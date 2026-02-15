import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Agents } from "../../features/Agents/Agents";
const AgentsPage: FC = () => {
  return (
    <>
      <PageMeta title={`Agents Analytics`} description="Track Your Agents." />

      <Agents />
    </>
  );
};

export default AgentsPage;
