export default function PaymentForm({ onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        className="w-full border px-4 py-2 rounded"
        required
      />

      <input
        type="text"
        name="receiver_email"
        placeholder="Recipient"
        className="w-full border px-4 py-2 rounded"
        required
      />

      <select
        name="method"
        className="w-full border px-4 py-2 rounded"
        required
      >
        <option value="">Select method</option>
        <option value="WALLET">Wallet</option>
        <option value="CARD">Card</option>
      </select>

      <button
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        {loading ? "Processing..." : "Continue"}
      </button>
    </form>
  );
}
