import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Management } from "../../features/User/UsersManagement";

const ManagementPage: FC = () => {
  return (
    <>
      <PageMeta
        title={`User Management`}
        description="View detailed information and analytics for User."
      />

      <Management />
    </>
  );
};

export default ManagementPage;
