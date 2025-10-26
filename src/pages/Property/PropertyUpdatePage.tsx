import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../hooks/useAuth";
import { PropertyForm } from "../../features/property/PropertyForm";
import { useParams } from "react-router";

const PropertyUpdatePage: FC = () => {
  const { user } = useAuth();

  return (
    <>
      <PageMeta
        title={`Property Update${
          user ? ` for ${user.firstName ?? user.role}` : ""
        }`}
        description="Update detailed information for a selected property."
      />

      <div className="container mx-auto px-4 py-6">
        <PropertyForm mode="edit" propertyId={useParams().id} />
      </div>
    </>
  );
};

export default PropertyUpdatePage;
