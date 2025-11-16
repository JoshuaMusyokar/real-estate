/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { PropertyLandingPage } from "../../features/Landing/LandingPage";
import { Template2PropertyLanding } from "../../features/Landing/Template2Landing";
import { Template3PropertyLanding } from "../../features/Landing/Template3Landing";
import { Template4PropertyLanding } from "../../features/Landing/Template4PropertyLanding";
import { useParams } from "react-router";
interface RouteParams {
  template: string;
  [key: string]: string | undefined; // Add index signature
}

export default function MainLanding() {
  const [activeTemplate, setActiveTemplate] = useState(1);
  const { template } = useParams<RouteParams>();

  useEffect(() => {
    if (template) {
      setActiveTemplate(parseInt(template));
    }
  }, [template]);

  const getTemplate = () => {
    switch (activeTemplate) {
      case 1:
        return <PropertyLandingPage />;

      case 2:
        return <Template2PropertyLanding />;
      case 3:
        return <Template3PropertyLanding />;
      case 4:
        return <Template4PropertyLanding />;
      default:
        return <PropertyLandingPage />;
    }
  };
  return (
    <>
      <PageMeta
        title="Landing Management"
        description="Find your dream home from our extensive property listings."
      />
      {getTemplate()}
    </>
  );
}
