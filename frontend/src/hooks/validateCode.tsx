import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateCode } from "@/api";

export const useValidateCode = (code: string | null) => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateCodeAPI = async () => {
      try {
        if (!code) {
          throw new Error();
        }
        const response = await validateCode(code);
        if (!response.data.success) {
          throw new Error();
        }
      } catch (error) {
        console.log(error);
        alert("Invalid or expired code. Redirecting to the homepage.");
          navigate("/");
      }
    };
    validateCodeAPI();
  }, [code, navigate]);
};
