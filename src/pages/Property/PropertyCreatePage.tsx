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

      <div>
        <PropertyForm mode="create" />
      </div>
    </>
  );
};

export default PropertyCreatePage;
