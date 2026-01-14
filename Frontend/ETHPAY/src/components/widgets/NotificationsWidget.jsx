


export default function NotificationsWidget() {
  const notifications = [
    "Merchant ABC registered",
    "Payment of $120 completed",
    "System maintenance scheduled",
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <ul className="space-y-2">
        {notifications.map((note, i) => (
          <li key={i} className="text-gray-700 border-b pb-1">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
