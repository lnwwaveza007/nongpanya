import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "@/utils/axiosInstance";

export const useValidateCode = (code: string | null) => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateCode = async () => {
      try {
        if (!code) {
          throw new Error();
        }
        const response = await axiosInstance.get(`/code/validate?code=${code}`);
        if (!response.data.success) {
          throw new Error();
        }
      } catch (error) {
        alert("Invalid or expired code. Redirecting to the homepage.");
          navigate("/");
      }
    };
    validateCode();
  }, [code, navigate]);
};
