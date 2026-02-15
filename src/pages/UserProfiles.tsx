import PageBreadcrumb from "../components/common/PageBreadCrumb";

import PageMeta from "../components/common/PageMeta";
import { UserProfile } from "../features/User/Profile";

export default function UserProfilesPage() {
  return (
    <>
      <PageMeta
        title="Bengal Profile Dashboard"
        description="This is Bengal Profile Dashboard page for users"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <UserProfile />
    </>
  );
}
