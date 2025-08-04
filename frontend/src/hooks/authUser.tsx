import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "@/api/auth";

const authUser = (Component: JSX.Element) => {
  const AuthenticatedComponent = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const getSearchParams = new URLSearchParams(window.location.search);
    const code = getSearchParams.get("code");

    useEffect(() => {
      const verifyAuth = async () => {
        try {
          const response = await auth();
          setAuthenticated(response.data.success);
        } catch {
          setAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };

      verifyAuth();
    }, []);

    if (loading) {
      return (
        <div className="text-center text-2xl font-bold">
          .·´¯`(&gt;▂&lt;)´¯`·.{" "}
        </div>
      );
    }
    if (!authenticated) {
      if (code) {
        return <Navigate to={`/?code=${code}`} replace />;
      }
      return <Navigate to="/" replace />;
    }

    return Component;
  };

  return <AuthenticatedComponent />;
};

export default authUser;
