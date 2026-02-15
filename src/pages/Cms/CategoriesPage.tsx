import { type FC } from "react";
import PageMeta from "../../components/common/PageMeta";
import { Categories } from "../../features/Cms/Categories";

const CategoriesPage: FC = () => {
  return (
    <>
      <PageMeta
        title={`Categories Management`}
        description="View detailed information and analytics for Categories."
      />

      <Categories />
    </>
  );
};

export default CategoriesPage;
