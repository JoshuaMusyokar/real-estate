/* eslint-disable @typescript-eslint/no-unused-vars */
import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Footer } from "../../layout/Footer";
import { AmenitiesManagement } from "../../features/Amenities/AmenityManagement";

const AmenityPage: FC = () => {
  return (
    <>
      <PageMeta
        title={`Amenities Amenities`}
        description="Amenity Management."
      />

      <AmenitiesManagement />
    </>
  );
};

export default AmenityPage;
