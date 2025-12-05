import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import PropertyTypesManagement from "../../features/PropertyTypes/PropertyManagement";

const PropertyTypesManagementPage: FC = () => {
  return (
    <>
      <PageMeta
        title={`Property type Management`}
        description="View detailed information and analytics for Property type and sub types."
      />

      <div className="container mx-auto px-4 py-6">
        <PropertyTypesManagement />
      </div>
    </>
  );
};

export default PropertyTypesManagementPage;
