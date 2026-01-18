import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import LeadsAnalytics from "../../features/Analytics/LeadsAnalytics";
const LeadsAnalyticsPage: FC = () => {
  return (
    <>
      <PageMeta title={`Leads Analytics`} description="Track Your Leads." />

      <div className="mx-auto px-4 py-6">
        <LeadsAnalytics />
      </div>
    </>
  );
};

export default LeadsAnalyticsPage;
