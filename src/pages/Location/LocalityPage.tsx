import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import { CitiesManagement } from "../../features/Location/CitiesManagement";

const CitiesPage: FC = () => {
  return (
    <>
      <PageMeta
        title={`User Management`}
        description="View detailed information and analytics for City."
      />
      <CitiesManagement />
    </>
  );
};

export default CitiesPage;
