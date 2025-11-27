import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import { LocalitiesManagement } from "../../features/Location/LocatilityManagement";

const LocalityPage: FC = () => {
  return (
    <>
      <PageMeta
        title={`Locality Management`}
        description="View detailed information and analytics for Locality."
      />

      <div className="container mx-auto px-4 py-6">
        <LocalitiesManagement />
      </div>
    </>
  );
};

export default LocalityPage;
