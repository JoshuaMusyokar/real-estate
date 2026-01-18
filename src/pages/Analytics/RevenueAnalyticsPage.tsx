import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import RevenueAnalytics from "../../features/Analytics/RevenueAnalytics";
const RevenueAnalyticsPage: FC = () => {
  return (
    <>
      <PageMeta title={`Revenue Analytics`} description="Track Your revenue." />

      <div className="mx-auto px-4 py-6">
        <RevenueAnalytics />
      </div>
    </>
  );
};

export default RevenueAnalyticsPage;
