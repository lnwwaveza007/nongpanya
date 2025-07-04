import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { redirectAuth } from "@/api";

const Redirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const redirectAuthAPI = async () => {
      const response = await redirectAuth(code || '');
      try {
        if (response.status === 200) {
          const resCode = response.data?.data?.code; // Use optional chaining to avoid errors
          if (response.data.success) {
            navigate(`/form?code=${resCode}`);
          } else {
            navigate(`/`);
          }
        }
      } catch (error) {
        console.error(error);
        navigate(`/`);
      }
  };

  useEffect(() => {
    redirectAuthAPI();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      {/* Main Card Container */}
      <Card className="w-full max-w-md p-8 text-center space-y-8 transition-all duration-300 hover:shadow-xl animate-fade-in border-[#FF4B28] relative">
        {/* Animated Face */}
        <div className="text-center">
          <div
            className="text-6xl font-bold transition-all duration-300 hover:scale-110 cursor-pointer mb-4"
            style={{ color: "#FF4B28" }}
          >
            (｡•ᴗ•｡)
          </div>
          <h1
            className="text-3xl font-bold animate-bounce"
            style={{ color: "#FF4B28" }}
          >
            Redirect...
          </h1>
        </div>

        {/* Animated Pills */}
        <div className="flex justify-center items-center space-x-2 pt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-6 h-12 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Redirect;
