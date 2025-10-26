import PageMeta from "../../components/common/PageMeta";
import { PropertyLandingPage } from "../../features/Landing/LandingPage";

export default function MainLanding() {
  return (
    <>
      <PageMeta
        title="Landing Management"
        description="Find your dream home from our extensive property listings."
      />
      <PropertyLandingPage />
    </>
  );
}
