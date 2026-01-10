from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer
from bank.services import notify, log_action


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            user = self.serializer_class.get_user(request.data)

            log_action(
                user=user,
                action="LOGIN",
                description="User logged in successfully."
            )

            notify(
                user=user,
                event="LOGIN",
                message="You logged in successfully."
            )

        return response
