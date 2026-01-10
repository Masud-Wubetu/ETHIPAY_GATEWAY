from rest_framework.permissions import BasePermission

class IsAdminOrOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return request.user in [obj.payer, obj.payee]
