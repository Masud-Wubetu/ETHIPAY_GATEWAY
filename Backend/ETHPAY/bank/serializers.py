# bank/serializers.py
from rest_framework import serializers
from .models import BankAccount, Transaction, Payment, SystemLog, Receipt, Notification
from user.models import User
from bank.services import log_action, notify
from .services import calculate_service_fee, calculate_total, SimulatedBankService
from django.db import transaction as db_transaction
import uuid


class BankAccountSerializer(serializers.ModelSerializer):
    owner_email = serializers.CharField(source='owner.email', read_only=True)

    class Meta:
        model = BankAccount
        fields = ["id", "owner_email", "account_number", "balance"]

class TransactionSerializer(serializers.ModelSerializer):
    sender_email = serializers.CharField(source='sender.email', read_only=True)
    receiver_email = serializers.CharField(source='receiver.email', read_only=True)

    class Meta:
        model = Transaction
        fields = ["id", "sender_email", "receiver_email", "amount", "status", "created_at"]


class BankTransferSerializer(serializers.Serializer):
    receiver_email = serializers.EmailField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)

    def validate_receiver_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Receiver does not exist.")
        if user == self.context['request'].user:
            raise serializers.ValidationError("You cannot transfer to yourself.")
        return value

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive.")
        return value

    def validate(self, attrs):
        sender = self.context['request'].user
        sender_account = sender.account
        if attrs['amount'] > sender_account.balance:
            raise serializers.ValidationError("Insufficient balance.")
        return attrs

    def create(self, validated_data):
        sender = self.context['request'].user
        receiver = User.objects.get(email=validated_data['receiver_email'])
        amount = validated_data['amount']

        sender_account = sender.account
        receiver_account = receiver.account

        # Use atomic transaction to avoid partial updates
        with db_transaction.atomic():
            sender_account.balance -= amount
            receiver_account.balance += amount
            sender_account.save()
            receiver_account.save()

            transaction_record = Transaction.objects.create(
                sender=sender,
                receiver=receiver,
                amount=amount,
                status="SUCCESS"
            )
        return transaction_record
    
class PaymentInitiateSerializer(serializers.ModelSerializer):
    receiver_email = serializers.EmailField(write_only=True)

    class Meta:
        model = Payment
        fields = ["id", "receiver_email", "amount", "method", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_receiver_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Receiver does not exist.")
        if user == self.context["request"].user:
            raise serializers.ValidationError("You cannot pay yourself.")
        return value

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive.")
        return value

    def create(self, validated_data):
        sender = self.context["request"].user
        receiver = User.objects.get(email=validated_data.pop("receiver_email"))

        return Payment.objects.create(
            sender=sender,
            receiver=receiver,
            amount=validated_data["amount"],
            method=validated_data["method"],
            status="PENDING"
        )

class PaymentValidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "status"]

    def validate(self, attrs):
        if self.instance.status != "PENDING":
            raise serializers.ValidationError("Only pending payments allowed.")
        return attrs

    def update(self, instance, validated_data):
        sender = instance.sender
        receiver = instance.receiver
        amount = instance.amount
        service_fee = calculate_service_fee(amount)
        total = calculate_total(amount)

        sender_account = sender.account
        receiver_account = receiver.account

        if sender_account.balance < total:
            instance.status = "FAILED"
            instance.save()

            log_action(
                user=sender,
                action="PAYMENT_FAILED",
                description=f"Failed to pay {amount} to {receiver.email}. Reason: Insufficient balance."
            )


            notify(
                user=sender,
                event="PAYMENT_FAILED",
                message="Your payment failed due to insufficient balance."
            )

            raise serializers.ValidationError("Insufficient balance.")

        bank_response = SimulatedBankService.process_payment(total)

        if not bank_response["approved"]:
            instance.status = "FAILED"
            instance.save()

            log_action(
                user=sender,
                action="PAYMENT_FAILED",
                description=f"Failed to pay {amount} to {receiver.email}. Reason: Insufficient balance."
            )

            notify(
                user=sender,
                event="PAYMENT_FAILED",
                message="Your payment failed due to insufficient balance."
            )

            raise serializers.ValidationError(bank_response["reason"])

        with db_transaction.atomic():
            sender_account.balance -= total
            receiver_account.balance += amount
            sender_account.save()
            receiver_account.save()

            transaction_record = Transaction.objects.create(
                sender=sender,
                receiver=receiver,
                amount=amount,
                service_fee=service_fee,
                total_debited=total,
                status="SUCCESS"
            )

            Receipt.objects.create(
                transaction=transaction_record,
                receipt_number=f"RCPT-{uuid.uuid4().hex[:10].upper()}",
                payer=sender,
                payee=receiver,
                amount=amount,
                service_fee=service_fee,
                total=total
            )

            instance.status = "COMPLETED"

             # After successful payment
            log_action(
                user=sender,
                action="PAYMENT_SUCCESS",
                description=f"Paid {amount} to {receiver.email}. Service fee: {service_fee}."
            )

            notify(
                user=sender,
                event="PAYMENT_SUCCESS",
                message=f"Payment of {amount} completed successfully."
            )

            notify(
                user=receiver,
                event="PAYMENT_SUCCESS",
                message=f"You received {amount} from {sender.email}."
            )

            instance.save()

        return instance


class PaymentCancelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "status"]

    def update(self, instance, validated_data):
        if instance.status != "PENDING":
            raise serializers.ValidationError("Only pending payments can be cancelled.")

        instance.status = "CANCELLED"
        instance.save()
        return instance

class TransactionHistorySerializer(serializers.ModelSerializer):
    sender_email = serializers.CharField(source="sender.email", read_only=True)
    receiver_email = serializers.CharField(source="receiver.email", read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id",
            "sender_email",
            "receiver_email",
            "amount",
            "service_fee",
            "total_debited",
            "status",
            "created_at"
        ]

class ReceiptSerializer(serializers.ModelSerializer):
    payer_email = serializers.CharField(source="payer.email", read_only=True)
    payee_email = serializers.CharField(source="payee.email", read_only=True)

    class Meta:
        model = Receipt
        fields = [
            "receipt_number",
            "payer_email",
            "payee_email",
            "amount",
            "service_fee",
            "total",
            "issued_at"
        ]

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "event",
            "message",
            "is_read",
            "created_at",
        ]

class SystemLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = SystemLog
        fields = ["id", "user_email", "action", "description", "created_at"]
