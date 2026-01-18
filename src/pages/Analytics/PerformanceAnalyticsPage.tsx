import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import PerformanceAnalytics from "../../features/Analytics/PerformanceAnalytics";
const PerformanceAnalyticsPage: FC = () => {
  return (
    <>
      <PageMeta
        title={`Performance Analytics`}
        description="Track Your Agents Performance."
      />

      <div className="mx-auto px-4 py-6">
        <PerformanceAnalytics />
      </div>
    </>
  );
};

export default PerformanceAnalyticsPage;
