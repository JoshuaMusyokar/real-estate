import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import { ContentList } from "../../features/Cms/ContentList";

const ContentsPage: FC = () => {
  return (
    <>
      <PageMeta
        title={`Contents Management`}
        description="View detailed information and analytics for Contents."
      />

      <div className="container mx-auto px-4 py-6">
        <ContentList />
      </div>
    </>
  );
};

export default ContentsPage;
