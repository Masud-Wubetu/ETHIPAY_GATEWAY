import BalanceWidget from "../components/widgets/BalanceWidget";
import TransactionSummaryWidget from "../components/widgets/TransactionSummaryWidget";
import NotificationsWidget from "../components/widgets/NotificationsWidget";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left: widgets */}
      <div className="flex-1 space-y-6">
        <BalanceWidget balance={1200} />
        <TransactionSummaryWidget total={32} success={29} failed={3} />
        <NotificationsWidget
          notifications={["Payment completed", "Balance updated", "New receipt available"]}
        />
      </div>
    </div>
  );
}
