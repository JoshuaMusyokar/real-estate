import PageMeta from "../../components/common/PageMeta";
import { PropertyManagement } from "../../features/property/PropertyManagement";

export default function Property() {
  return (
    <>
      <PageMeta
        title="Property Management"
        description="This is the Property Management page."
      />
      <PropertyManagement />
    </>
  );
}
