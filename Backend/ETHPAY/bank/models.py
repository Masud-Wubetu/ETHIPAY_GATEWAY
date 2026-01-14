
from django.db import models
from user.models import User
import uuid

class BankAccount(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name="account")
    account_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=10000)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.owner.email} - {self.account_number}"


class Transaction(models.Model):
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
    )

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_transactions")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_transactions")

    amount = models.DecimalField(max_digits=12, decimal_places=2)
    service_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_debited = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.email} -> {self.receiver.email} | {self.amount} | {self.status}"


class Payment(models.Model):
    PAYMENT_STATUS = (
        ("PENDING", "Pending"),
        ("COMPLETED", "Completed"),
        ("FAILED", "Failed"),
        ("CANCELLED", "Cancelled"),
    )

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments_sent")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments_received")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    method = models.CharField(max_length=20)  # WALLET, BANK
    status = models.CharField(max_length=12, choices=PAYMENT_STATUS, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id} | {self.sender} → {self.receiver} | {self.status}"
    

class Receipt(models.Model):
    transaction = models.OneToOneField(
        Transaction,
        on_delete=models.CASCADE,
        related_name="receipt"
    )

    receipt_number = models.CharField(max_length=50, unique=True)
    issued_at = models.DateTimeField(auto_now_add=True)

    payer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="paid_receipts")
    payee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_receipts")

    amount = models.DecimalField(max_digits=12, decimal_places=2)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=12, decimal_places=2)


class Notification(models.Model):
    EVENT_CHOICES = (
        ("LOGIN", "Login"),
        ("PAYMENT_SUCCESS", "Payment Success"),
        ("PAYMENT_FAILED", "Payment Failed"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    event = models.CharField(max_length=30, choices=EVENT_CHOICES)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.event}"

class SystemLog(models.Model):
    ACTION_CHOICES = [
        ("LOGIN", "User Login"),
        ("PAYMENT_SUCCESS", "Payment Success"),
        ("PAYMENT_FAILED", "Payment Failed"),
        ("TRANSFER", "Bank Transfer"),
        ("CANCEL_PAYMENT", "Payment Cancelled"),
        # add more if needed
    ]

    user = models.ForeignKey('user.User', on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.created_at} | {self.user} | {self.action}"