import { type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PageMeta from "../../components/common/PageMeta";
import { PropertyDetailBuyer } from "../../features/Buyers/PropertyDetailBuyer";
import { PublicHeader } from "../../layout/PublicHeader";
import { Footer } from "../../layout/Footer";
import { setFilters } from "../../store/slices/filterSlice";
import { encodeFilters } from "../../utils/filterEncoder";
import type { PropertySearchFilters } from "../../types";
import type { RootState } from "../../store/store";

// Define the expected URL params
interface RouteParams {
  slug: string;
  [key: string]: string | undefined;
}

const PropertyDetailBuyerPage: FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get current filters from Redux
  const currentFilters = useSelector(
    (state: RootState) => state.filters.currentFilters,
  );

  const handleLocalityChange = (localityId: string, localityName?: string) => {
    if (localityId && localityName) {
      // Add locality to existing filters
      const updatedFilters: PropertySearchFilters = {
        ...currentFilters,
        localityId: localityId,
        locality: [localityName],
        page: 1,
      };

      // Update Redux
      dispatch(setFilters(updatedFilters));

      // Encode and navigate
      const encoded = encodeFilters(updatedFilters);
      if (encoded) {
        navigate(`/properties/search/${encoded}`, { replace: true });
      } else {
        navigate(`/properties/search`, { replace: true });
      }
    } else {
      // Clear locality from filters
      const updatedFilters: PropertySearchFilters = {
        ...currentFilters,
        page: 1,
      };
      delete updatedFilters.localityId;
      delete updatedFilters.locality;

      // Update Redux
      dispatch(setFilters(updatedFilters));

      // Encode and navigate
      const encoded = encodeFilters(updatedFilters);
      if (encoded) {
        navigate(`/properties/search/${encoded}`, { replace: true });
      } else {
        navigate(`/properties/search`, { replace: true });
      }
    }
  };

  // Handle city change from header
  const handleCityChange = (cityId: string, cityName?: string) => {
    // Reset filters with new city
    const updatedFilters: PropertySearchFilters = {
      page: 1,
      limit: 20,
      status: "AVAILABLE",
      sortBy: "createdAt",
      sortOrder: "desc",
      cityId: cityId,
      city: cityName ? [cityName] : undefined,
    };

    // Update Redux
    dispatch(setFilters(updatedFilters));

    // Encode and navigate
    const encoded = encodeFilters(updatedFilters);
    if (encoded) {
      navigate(`/properties/search/${encoded}`, { replace: true });
    } else {
      navigate(`/properties/search`, { replace: true });
    }
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
        <PropertyDetailBuyer id={id} />
        <Footer />
      </div>
    </>
  );
};

export default PropertyDetailBuyerPage;
