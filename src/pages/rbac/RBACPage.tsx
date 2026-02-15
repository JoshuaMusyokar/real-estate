import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";

import RBACManagement from "../../features/RBAC/RBACManagement";

const RBACPage: FC = () => {
  return (
    <>
      <PageMeta
        title={`RBAC Management`}
        description="View detailed information and analytics for RBAC."
      />

      <RBACManagement />
    </>
  );
};

export default RBACPage;
