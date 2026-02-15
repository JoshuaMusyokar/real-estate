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
      <ContentList />
    </>
  );
};

export default ContentsPage;
