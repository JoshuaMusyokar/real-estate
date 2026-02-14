import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import Notifications from "../../features/Notifications/Notifications";

const NotificationsPage: FC = () => {
  return (
    <>
      <PageMeta
        title={`Notifications Management`}
        description="Manage your Notifications."
      />

      <div className="container mx-auto px-4 py-6">
        <Notifications />
      </div>
    </>
  );
};

export default NotificationsPage;
