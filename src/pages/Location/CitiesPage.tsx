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
      <LocalitiesManagement />
    </>
  );
};

export default LocalityPage;
