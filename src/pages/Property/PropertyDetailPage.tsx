import { type FC } from "react";
import { useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import { PropertyDetail } from "../../features/property/PropertyDetail";
import { useAuth } from "../../hooks/useAuth";

// Define the expected URL params
interface RouteParams {
  slug: string;
  [key: string]: string | undefined; // Add index signature
}

const PropertyDetailPage: FC = () => {
  const { user } = useAuth();
  const { slug } = useParams<RouteParams>();

  // Handle invalid or missing slug
  if (!slug) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Invalid property URL — missing slug.
      </div>
    );
  }
  if (!user) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Please Login.
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`Property Details${
          user ? ` for ${user.firstName ?? user.role}` : ""
        }`}
        description="View detailed information and analytics for a selected property."
      />

      <div className="container mx-auto px-4 py-6">
        <PropertyDetail
          slug={slug}
          userRole={user.role.name ?? "guest"}
          userId={user?.id ?? ""}
        />
      </div>
    </>
  );
};

export default PropertyDetailPage;
