
from rest_framework import generics, permissions
from bank.permissions import IsAdminOrOwner
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import BankAccount, Payment, Transaction, Receipt
from .serializers import BankAccountSerializer, TransactionSerializer, BankTransferSerializer
from user.models import User
from .models import Notification, SystemLog
from rest_framework import generics, permissions
from bank.services import log_action
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from reportlab.pdfgen import canvas
from rest_framework.exceptions import PermissionDenied
from .serializers import (
    PaymentInitiateSerializer,
    PaymentValidateSerializer,
    PaymentCancelSerializer,
    TransactionHistorySerializer,
    ReceiptSerializer,
    SystemLogSerializer,
    NotificationSerializer
)


# View all accounts (Admin only)
class BankAccountListView(generics.ListAPIView):
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer
    permission_classes = [permissions.IsAdminUser]

# View current user's account
class MyAccountView(generics.RetrieveAPIView):
    serializer_class = BankAccountSerializer

    def get_object(self):
        return self.request.user.account


# Bank transfer using serializer
class BankTransferAPIView(generics.CreateAPIView):
    serializer_class = BankTransferSerializer
    permission_classes = [permissions.IsAuthenticated]  # Only logged-in users can transfer



    def perform_create(self, serializer):
        serializer.save()
        log_action(
            user=self.request.user,
            action="TRANSFER",
            description=f"Transferred {serializer.validated_data['amount']} to {serializer.validated_data['receiver_email']}."
        )

class InitiatePaymentAPIView(generics.CreateAPIView):
    serializer_class = PaymentInitiateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}
    

class ValidatePaymentAPIView(generics.UpdateAPIView):
    serializer_class = PaymentValidateSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Payment.objects.all()

    def get_object(self):
        payment = super().get_object()

        if payment.sender != self.request.user:
            raise PermissionDenied("You cannot validate this payment.")

        if payment.status != "PENDING":
            raise PermissionDenied("Only pending payments can be validated.")

        return payment


class CancelPaymentAPIView(generics.UpdateAPIView):
    serializer_class = PaymentCancelSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Payment.objects.all()

    def get_object(self):
        payment = super().get_object()

        if payment.sender != self.request.user:
            raise PermissionDenied("You cannot cancel this payment.")

        log_action(
            user=payment.sender,
            action="CANCEL_PAYMENT",
            description=f"Cancelled payment of {payment.amount} to {payment.receiver.email}."
        )

        return payment


class TransactionHistoryAPIView(generics.ListAPIView):
    serializer_class = TransactionHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Transaction.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by("-created_at")
    

from bank.permissions import IsAdminOrOwner

class ReceiptDetailView(GenericAPIView):
    serializer_class = ReceiptSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

    def get_object(self):
        receipt = get_object_or_404(
            Receipt,
            transaction_id=self.kwargs["transaction_id"]
        )
        self.check_object_permissions(self.request, receipt)
        return receipt

    def get(self, request, transaction_id):
        receipt = self.get_object()
        serializer = self.get_serializer(receipt)
        return Response(serializer.data)
    
class ReceiptPDFView(GenericAPIView):
    permission_classes = [IsAuthenticated, IsAdminOrOwner]
    queryset = Receipt.objects.all()

    def get_object(self):
        receipt = get_object_or_404(
            Receipt,
            id=self.kwargs["receipt_id"]
        )
        self.check_object_permissions(self.request, receipt)
        return receipt

    def get(self, request, receipt_id):
        receipt = self.get_object()

        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = (
            f'attachment; filename="receipt_{receipt.id}.pdf"'
        )

        p = canvas.Canvas(response)
        p.drawString(100, 800, "ETHPAY Payment Receipt")
        p.drawString(100, 770, f"Receipt ID: {receipt.id}")
        p.drawString(100, 750, f"Payer: {receipt.payer.email}")
        p.drawString(100, 730, f"Payee: {receipt.payee.email}")
        p.drawString(100, 710, f"Amount: {receipt.amount}")
        p.drawString(100, 690, f"Service Fee: {receipt.service_fee}")
        p.drawString(100, 670, f"Total Paid: {receipt.total}")
        p.drawString(100, 650, f"Date: {receipt.created_at}")

        p.showPage()
        p.save()

        return response

    

class ReceiptListView(ListAPIView):
    serializer_class = ReceiptSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Receipt.objects.all().order_by("-created_at")

        return Receipt.objects.filter(
            payer=user
        ) | Receipt.objects.filter(
            payee=user
        )
    

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.notifications.order_by("-created_at")


class MarkNotificationReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all()

    def get_object(self):
        notification = super().get_object()
        if notification.user != self.request.user:
            raise PermissionDenied("Not allowed")
        return notification

    def perform_update(self, serializer):
        serializer.save(is_read=True)

class SystemLogListView(generics.ListAPIView):
    serializer_class = SystemLogSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = SystemLog.objects.all().order_by("-created_at")
        user_id = self.request.query_params.get("user")
        action = self.request.query_params.get("action")
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if action:
            queryset = queryset.filter(action=action)
        return queryset