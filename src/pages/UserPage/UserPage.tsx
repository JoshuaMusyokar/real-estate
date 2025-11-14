import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import { UserManagement } from "../../features/User/UserManagement";

const UserManagementPage: FC = () => {
  return (
    <>
      <PageMeta
        title={`User Management`}
        description="View detailed information and analytics for User."
      />

      <div className="container mx-auto px-4 py-6">
        <UserManagement />
      </div>
    </>
  );
};

export default UserManagementPage;
