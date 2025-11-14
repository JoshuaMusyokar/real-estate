import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Agents } from "../../features/Agents/Agents";
const AgentsPage: FC = () => {
  return (
    <>
      <PageMeta title={`Agents Analytics`} description="Track Your Agents." />

      <div className="mx-auto px-4 py-6">
        <Agents />
      </div>
    </>
  );
};

export default AgentsPage;
