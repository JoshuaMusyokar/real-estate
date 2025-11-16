import PageMeta from "../../components/common/PageMeta";
import { Template2PropertyLanding } from "../../features/Landing/Template2Landing";

export default function MainLanding() {
  return (
    <>
      <PageMeta
        title="Landing Management"
        description="Find your dream home from our extensive property listings."
      />
      <Template2PropertyLanding />
    </>
  );
}
