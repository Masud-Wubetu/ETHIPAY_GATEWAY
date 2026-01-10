import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import TransactionSummary from "../components/widgets/TransactionSummaryWidget";
import UserStats from "../components/widgets/UserStats";
import NotificationsPreview from "../components/widgets/NotificationsWidget";
import RevenueChart from "../components/widgets/RevenueChart";

export default function AdminDashboard() {
  return (
   <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700">
      <Navbar />

      <main className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Welcome, Admin</h1>

        {/* Dashboard widgets grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <TransactionSummary />
          <UserStats />
          <NotificationsPreview />
          <RevenueChart />
        </div>
      </main>
    </div>
  );
}
