import { axiosInstance } from "@/utils/axiosInstance";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const authUser = (Component: JSX.Element) => {
  const AuthenticatedComponent = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const verifyAuth = async () => {
        try {
          const response = await axiosInstance.get("/auth");
          setAuthenticated(response.data.success);
        } catch (error) {
          setAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };

      verifyAuth();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!authenticated) {
      return <Navigate to="/" replace />;
    }

    return Component;
  };

  return <AuthenticatedComponent />;
};

export default authUser;
