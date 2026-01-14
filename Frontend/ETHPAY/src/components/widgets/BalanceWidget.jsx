

export default function BalanceWidget({ balance }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-gray-500 text-sm">Current Balance</h3>
      <p className="text-3xl font-bold text-indigo-600 mt-2">
        {balance} ETB
      </p>
    </div>
  );
}
