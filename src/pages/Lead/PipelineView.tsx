import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import { PipelineView } from "../../features/Lead/PipelineView";

const PipelineViewPage: FC = () => {
  return (
    <>
      <PageMeta title={`Pipeline View`} description="Pipeline view of leads." />

      <PipelineView />
    </>
  );
};

export default PipelineViewPage;
