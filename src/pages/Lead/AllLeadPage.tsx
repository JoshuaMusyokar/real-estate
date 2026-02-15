import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";

import { AllLeads } from "../../features/Lead/AllLeadPage";

const AllLeadsPage: FC = () => {
  return (
    <>
      <PageMeta
        title={`Lead List`}
        description="View detailed information and analytics for a selected lead."
      />

      <AllLeads />
    </>
  );
};

export default AllLeadsPage;
