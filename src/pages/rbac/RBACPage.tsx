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

      <div className="container mx-auto px-4 py-6">
        <RBACManagement />
      </div>
    </>
  );
};

export default RBACPage;
