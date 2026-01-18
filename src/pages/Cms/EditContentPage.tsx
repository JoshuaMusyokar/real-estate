import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { ContentForm } from "../../features/Cms/ContentForm";

const EditContentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate("/cms");
    return null;
  }

  const handleSuccess = () => {
    navigate("/cms");
  };

  const handleCancel = () => {
    navigate("/cms");
  };

  return (
    <>
      <PageMeta
        title={`Edit Contents`}
        description="Edit information and analytics for Contents."
      />
      <div className="py-6">
        <div className="mb-6">
          <Button
            variant="primary"
            onClick={() => navigate("/cms/content")}
            endIcon={<ArrowLeft className="h-4 w-4" />}
            className="mb-4"
          >
            Back to Content
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Edit Content
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Update your content details
          </p>
        </div>

        <ContentForm
          contentId={id}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </>
  );
};

export default EditContentPage;
