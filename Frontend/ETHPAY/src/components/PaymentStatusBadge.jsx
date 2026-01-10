export default function PaymentStatusBadge({ status }) {
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-200 text-gray-600",
  };

  return (
    <span className={`px-3 py-1 rounded text-sm ${colors[status]}`}>
      {status}
    </span>
  );
}
