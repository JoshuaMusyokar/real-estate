import React from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import { ContentForm } from "./ContentForm";
import Button from "../../components/ui/button/Button";

const CreateContentPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/cms");
  };

  const handleCancel = () => {
    navigate("/cms");
  };

  return (
    <>
      <div className="py-6">
        <div className="mb-6">
          <Button
            variant="primary"
            onClick={() => navigate("/cms/content")}
            startIcon={<ArrowLeft className="h-4 w-4" />}
            className="mb-4"
          >
            Back to Content
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Create New Content
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Fill in the details below to create new content
          </p>
        </div>

        <ContentForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </>
  );
};

export default CreateContentPage;
