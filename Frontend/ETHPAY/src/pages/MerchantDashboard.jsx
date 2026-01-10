import BalanceWidget from "../components/widgets/BalanceWidget";
import TransactionSummaryWidget from "../components/widgets/TransactionSummaryWidget";

export default function MerchantDashboard() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <BalanceWidget balance={8450} />

      <TransactionSummaryWidget
        total={210}
        success={198}
        failed={12}
      />
    </div>
  );
}
