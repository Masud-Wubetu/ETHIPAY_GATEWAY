import { useEffect, useState } from "react";
import api from "../api/axios";
import PageWrapper from "../components/PageWrapper";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    try {
      const res = await api.get("payments/my/");
      setPayments(res.data);
    } catch (err) {
      setError("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const cancelPayment = async (id) => {
    if (!confirm("Cancel this payment?")) return;

    try {
      await api.post(`payments/${id}/cancel/`);
      fetchPayments(); // refresh table
    } catch (err) {
      alert(err.response?.data?.detail || "Cancel failed");
    }
  };

  return (
    <PageWrapper title="My Payments">
      {loading && <p>Loading payments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && payments.length === 0 && (
        <p className="text-gray-500">No payments found.</p>
      )}

      {!loading && payments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Reference</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Recipient</th>
                <th className="px-4 py-2 text-left">Method</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">{p.reference}</td>
                  <td className="px-4 py-2">{p.amount}</td>
                  <td className="px-4 py-2">{p.recipient}</td>
                  <td className="px-4 py-2">{p.method}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        p.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : p.status === "CANCELLED"
                          ? "bg-gray-200 text-gray-700"
                          : p.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {p.status === "PENDING" ? (
                      <button
                        onClick={() => cancelPayment(p.id)}
                        className="text-red-600 hover:underline"
                      >
                        Cancel
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageWrapper>
  );
}
