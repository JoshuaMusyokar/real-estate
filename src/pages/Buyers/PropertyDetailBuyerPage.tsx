/* eslint-disable @typescript-eslint/no-unused-vars */
import { type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../hooks/useAuth";
import { PropertyDetailBuyer } from "../../features/Buyers/PropertyDetailBuyer";
import { PublicHeader } from "../../layout/PublicHeader";

// Define the expected URL params
interface RouteParams {
  slug: string;
  [key: string]: string | undefined; // Add index signature
}

const PropertyDetailBuyerPage: FC = () => {
  //   const { user } = useAuth();
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();

  // Handle invalid or missing slug
  if (!id) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Invalid property URL — missing slug.
      </div>
    );
  }
  const handleShowFavorites = () => {
    // Navigate to favorites page or show favorites modal
    navigate("/saved-properties");
  };

  const handleShowAppointments = () => {
    // Navigate to appointments page
    navigate("/appointments");
  };
  return (
    <>
      <PageMeta
        title={`Property Details`}
        description="View detailed information and analytics for a selected property."
      />
      <PublicHeader
        onShowFavorites={handleShowFavorites}
        onShowAppointments={handleShowAppointments}
      />
      <div className="mx-auto px-4 py-6">
        <PropertyDetailBuyer
          id={id}
          //   userRole={user ? user.role : undefined}
          //   userId={user?.id ?? ""}
        />
      </div>
    </>
  );
};

export default PropertyDetailBuyerPage;
