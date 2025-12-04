/* eslint-disable @typescript-eslint/no-unused-vars */
import { type FC } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const handleLocalityChange = (localityId: string, localityName?: string) => {
    if (localityId) {
      const newParams = new URLSearchParams(searchParams);

      // Set locality parameters
      newParams.set("localityId", localityId);

      if (localityName) {
        newParams.set("search", localityName);
        newParams.set("locality", localityName);
      }
      newParams.delete("page");

      // Update URL immediately
      navigate(`/listings/buy?${newParams.toString()}`, { replace: true });
    } else {
      // Clear locality
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("localityId");
      newParams.delete("locality");
      newParams.delete("page");

      // Update URL immediately
      navigate(`/listings/buy?${newParams.toString()}`, { replace: true });
    }
  };
  // Handle city change from header
  const handleCityChange = (cityId: string, cityName?: string) => {
    const newParams = new URLSearchParams(searchParams);

    // Update URL query params
    newParams.set("cityId", cityId);
    if (cityName) newParams.set("city", cityName);
    newParams.delete("localityId");
    newParams.delete("locality");
    newParams.delete("page");

    navigate(`/listings/buy?${newParams.toString()}`, { replace: true });
  };
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

      <div className="mx-auto px-4 py-6">
        <PublicHeader
          onShowFavorites={handleShowFavorites}
          onShowAppointments={handleShowAppointments}
          displaySearchBar={true}
          onLocalityChange={handleLocalityChange}
          onCityChange={handleCityChange}
        />
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
