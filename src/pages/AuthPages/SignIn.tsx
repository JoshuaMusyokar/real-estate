import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useSearchParams } from "react-router";
import { useEffect } from "react";
import Alert from "../../components/ui/alert/Alert";

export default function SignIn() {
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get("session") === "expired";
  const sessionInvalid = searchParams.get("session") === "invalid";

  useEffect(() => {
    if (sessionExpired) {
      // Show session expired message
      console.log("Session expired, showing message to user");
    }
  }, [sessionExpired]);
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        {sessionExpired && (
          <Alert
            message="Your session has expired. Please sign in again."
            title="Session Expired"
            variant="error"
          />
        )}

        {sessionInvalid && (
          <Alert
            message="Invalid session detected. Please sign in again."
            title="Invalid Session"
            variant="error"
          />
        )}
        <SignInForm />
      </AuthLayout>
    </>
  );
}
