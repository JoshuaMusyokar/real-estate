import { type FC } from "react";
import { useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";

import { LeadDetail } from "../../features/Lead/LeadDetail";

// Define the expected URL params
interface RouteParams {
  slug: string;
  [key: string]: string | undefined; // Add index signature
}

const LeadDetailPage: FC = () => {
  const { id } = useParams<RouteParams>();

  // Handle invalid or missing id
  if (!id) {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Invalid Lead URL — missing Id.
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`Lead Details`}
        description="View detailed information and analytics for a selected lead."
      />

      <LeadDetail leadId={id} />
    </>
  );
};

export default LeadDetailPage;
