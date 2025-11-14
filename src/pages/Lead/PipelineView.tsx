import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import { PipelineView } from "../../features/Lead/PipelineView";

const PipelineViewPage: FC = () => {
  return (
    <>
      <PageMeta title={`Pipeline View`} description="Pipeline view of leads." />

      <div className="container mx-auto px-4 py-6">
        <PipelineView />
      </div>
    </>
  );
};

export default PipelineViewPage;
