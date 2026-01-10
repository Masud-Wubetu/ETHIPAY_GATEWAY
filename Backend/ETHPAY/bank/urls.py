# bank/urls.py
from django.urls import path
from .views import BankAccountListView, MyAccountView, BankTransferAPIView, ReceiptDetailView
from .views import ReceiptDetailView
from .views import ReceiptPDFView
from .views import ReceiptListView
from .views import SystemLogListView
from .views import NotificationListView
from .views import MarkNotificationReadView
from .views import (
    InitiatePaymentAPIView,
    ValidatePaymentAPIView,
    CancelPaymentAPIView,
    TransactionHistoryAPIView
)

urlpatterns = [
    path("accounts/", BankAccountListView.as_view(), name="all-accounts"),  # Admin only
    path("my-account/", MyAccountView.as_view(), name="my-account"),
    path('transfer/', BankTransferAPIView.as_view(), name='bank-transfer'),
    path("payments/initiate/", InitiatePaymentAPIView.as_view(), name="initiate-payment" ),
    path("payments/<int:pk>/validate/", ValidatePaymentAPIView.as_view()),
    path("payments/<int:pk>/cancel/", CancelPaymentAPIView.as_view()),
    path("transactions/", TransactionHistoryAPIView.as_view()),
    path("receipts/<int:transaction_id>/", ReceiptDetailView.as_view()),
    path("receipts/", ReceiptListView.as_view()),
    path("receipts/pdf/<int:receipt_id>/", ReceiptPDFView.as_view()),
    path("notifications/", NotificationListView.as_view()),
    path("notifications/<int:pk>/read/", MarkNotificationReadView.as_view()),
    path("admin/logs/", SystemLogListView.as_view(), name="system-logs"),


]
