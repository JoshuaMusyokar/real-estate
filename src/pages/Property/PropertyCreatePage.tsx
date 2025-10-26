import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../hooks/useAuth";
import { PropertyForm } from "../../features/property/PropertyForm";

const PropertyCreatePage: FC = () => {
  const { user } = useAuth();

  return (
    <>
      <PageMeta
        title={`Property Update${
          user ? ` for ${user.firstName ?? user.role}` : ""
        }`}
        description="Create a new property listing with detailed information."
      />

      <div className="container mx-auto px-4 py-6">
        <PropertyForm mode="create" />
      </div>
    </>
  );
};

export default PropertyCreatePage;
