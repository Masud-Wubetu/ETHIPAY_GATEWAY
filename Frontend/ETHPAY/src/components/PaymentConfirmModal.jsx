// src/components/PaymentConfirmModal.jsx
export default function PaymentConfirmModal({
  paymentData,
  onClose,
  onConfirm,   // important!
  loading,
  message,
}) {
  if (!paymentData) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">
          {message || "Confirm Payment"}
        </h2>

        {!message && (
          <div className="mb-4">
            <p><b>Recipient:</b> {paymentData.receiver_email}</p>
            <p><b>Amount:</b> {paymentData.amount}</p>
            <p><b>Method:</b> {paymentData.method}</p>
          </div>
        )}

        <p>{message ? message : "Are you sure you want to proceed?"}</p>

        <div className="flex justify-end mt-6 gap-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={onConfirm}  // <--- use parent confirm
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
