from decimal import Decimal
import time
import random
from .models import Notification
from .models import SystemLog

SERVICE_FEE_PERCENT = Decimal("0.02")  # 2%

def calculate_service_fee(amount: Decimal) -> Decimal:
    return (amount * SERVICE_FEE_PERCENT).quantize(Decimal("0.01"))

def calculate_total(amount: Decimal) -> Decimal:
    fee = calculate_service_fee(amount)
    return amount + fee

class SimulatedBankService:
    @staticmethod
    def process_payment(amount):
        time.sleep(2)  # simulate bank delay

        if random.random() < 0.8:
            return {
                "approved": True,
                "reference": f"BANK-{random.randint(100000, 999999)}"
            }
        return {
            "approved": False,
            "reason": "Bank rejected the transaction"
        }

def notify(user, event, message):
    Notification.objects.create(
        user=user,
        event=event,
        message=message
    )

def log_action(user=None, action="", description=""):
    """
    Create a system log entry.
    """
    SystemLog.objects.create(user=user, action=action, description=description)
