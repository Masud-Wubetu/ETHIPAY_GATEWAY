

export default function TransactionSummaryWidget({ total, success, failed }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-gray-500 text-sm mb-2">Transactions</h3>
      <ul className="space-y-1">
        <li>Total: <strong>{total}</strong></li>
        <li className="text-green-600">Success: {success}</li>
        <li className="text-red-600">Failed: {failed}</li>
      </ul>
    </div>
  );
}
