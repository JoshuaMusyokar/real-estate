import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import PropertiesAnalytics from "../../features/Analytics/PropertyAnalytics";
const PropertiesAnalyticsPage: FC = () => {
  return (
    <>
      <PageMeta
        title={`Properties Analytics`}
        description="Track Your properties."
      />

      <div className="mx-auto px-4 py-6">
        <PropertiesAnalytics />
      </div>
    </>
  );
};

export default PropertiesAnalyticsPage;
