// src/pages/PaymentPage.jsx
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import PaymentForm from "../components/PaymentForm";
import PaymentConfirmModal from "../components/PaymentConfirmModal";
import PaymentStatusBadge from "../components/PaymentStatusBadge";
import { validatePayment } from "../utils/paymentValidator";
import { initiatePayment, cancelPayment } from "../api/paymentService";

export default function PaymentPage() {
  const { user } = useAuth();

  const [payment, setPayment] = useState(null); // finalized payment from backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [currentPaymentData, setCurrentPaymentData] = useState(null); // data to confirm

  // Submit payment form → open confirm modal
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));
    console.log("Form data submitted:", data)
    const validationError = validatePayment(data);

    if (validationError) {
      setError(validationError);
      return;
    }

    setCurrentPaymentData(data); // store for modal
    setError("");
    setShowConfirm(true); // open confirm modal
  };

  // Confirm payment → backend
  const confirmPayment = async () => {
  if (!currentPaymentData) return;
  if (!user?.token) {
    alert("You must be logged in to pay.");
    return;
  }

  setLoading(true);
  setError("");

  // Ensure required fields exist
  const paymentPayload = {
    receiver_email: currentPaymentData.receiver_email || "merchant@example.com",
    amount: currentPaymentData.amount || 50,
    method: currentPaymentData.method || "card",
  };

  try {
    const token = localStorage.getItem("access");
    const res = await initiatePayment(paymentPayload, user.token);
    setPayment(res);
    setCurrentPaymentData(null);
    setShowConfirm(false);
    alert("Payment initiated successfully!");
  } catch (err) {
    console.error("Payment failed:", err.message);
    setError(err.message || "Failed to initiate payment");
  } finally {
    setLoading(false);
  }
};


  // Cancel payment
  const handleCancelPayment = async () => {
    if (!payment || !user?.token) return;

    setLoading(true);
    setError("");

    try {
      await cancelPayment(payment.id, user.token);
      setPayment({ ...payment, status: "CANCELLED" });
      setShowCancelConfirm(false);
      alert("Payment cancelled successfully!");
    } catch (err) {
      console.error("Cancel failed:", err.message);
      setError(err.message || "Failed to cancel payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">New Payment</h1>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Payment Form */}
      {!payment && (
        <PaymentForm onSubmit={handleSubmit} loading={loading} />
      )}

      {/* Payment Result */}
      {payment && (
        <div className="mt-6 p-4 border rounded-lg space-y-2">
          <h2 className="font-semibold text-lg">Payment Details</h2>

          <p><b>ID:</b> {payment.id}</p>
          <p><b>Amount:</b> {payment.amount}</p>
          <p><b>Recipient:</b> {payment.receiver_email}</p>

          <div className="flex items-center gap-2">
            <b>Status:</b>
            <PaymentStatusBadge status={payment.status} />
          </div>

          {payment.status === "PENDING" && (
            <button
              onClick={() => {  
                console.log("Opening cancel modal"); 
                setShowCancelConfirm(true);
              }}
              disabled={loading}
              className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded disabled:opacity-50"
            >
              Cancel Payment
            </button>
          )}
        </div>
      )}

      {/* Confirm Initiation Modal */}
      {showConfirm && currentPaymentData && (
        <PaymentConfirmModal
          paymentData={currentPaymentData}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmPayment}
          loading={loading}
        />
      )}

      {/* Confirm Cancel Modal */}
      {showCancelConfirm && payment && (
        <>
         {console.log("Cancel modal should show")}
        <PaymentConfirmModal
          paymentData={payment}
          message="Are you sure you want to cancel this payment?"
          onConfirm={handleCancelPayment}
          onClose={() => setShowCancelConfirm(false)}
          loading={loading}
        />
      </>
      )}
    </div>
  );
}
