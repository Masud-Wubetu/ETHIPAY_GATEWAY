from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User
from bank.models import BankAccount

@receiver(post_save, sender=User)
def create_bank_account(sender, instance, created, **kwargs):
    if created and instance.role in ["MERCHANT", "CUSTOMER"]:
        BankAccount.objects.create(owner=instance)
