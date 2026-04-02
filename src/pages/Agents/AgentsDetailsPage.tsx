import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import { AgentDetail } from "../../features/Agents/AgentDetails";
const AgentDetailsPage: FC = () => {
  return (
    <>
      <PageMeta title={`Agents Details`} description="Track Your Agents." />

      <AgentDetail />
    </>
  );
};

export default AgentDetailsPage;
