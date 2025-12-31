export default function PaymentForm({ onPay }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow w-full max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6">Payment Details</h2>

      {/* Amount */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Amount</label>
        <input
          type="number"
          defaultValue={100}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Payment Method */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Payment Method</label>
        <select className="w-full border p-2 rounded">
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>PayPal</option>
          <option>UPI</option>
        </select>
      </div>

      {/* Card Details */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Card Number"
          className="border p-2 rounded col-span-3 sm:col-span-3"
        />
        <input
          type="text"
          placeholder="Expiry MM/YY"
          className="border p-2 rounded sm:col-span-1"
        />
        <input
          type="text"
          placeholder="CVV"
          className="border p-2 rounded sm:col-span-1"
        />
      </div>

      {/* Billing Address */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Billing Address</label>
        <textarea className="w-full border p-2 rounded" rows={3}></textarea>
      </div>

      {/* Promo Code */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Promo Code"
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Pay Button */}
      <button
        onClick={(e) => { e.preventDefault(); onPay(); }}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Pay Now
      </button>
    </div>
  );
}
