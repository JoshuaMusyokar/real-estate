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
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="outline"
              onClick={() => navigate("/cms")}
              startIcon={<ArrowLeft className="w-4 h-4" />}
              className="h-8 px-3 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
              Create Content
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Fill in details to create content
            </p>
          </div>
        </div>

        <ContentForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </>
  );
};

export default CreateContentPage;
