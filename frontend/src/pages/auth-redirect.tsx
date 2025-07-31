import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { redirectAuth } from "@/api";
import { getUser } from "@/api/user";

const Redirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    const redirectAuthAPI = async () => {
        try {
          const response = await redirectAuth(code || '');
          if (response.status === 200 && response.data.success) {
            // After successful authentication, fetch user data to store role information
            try {
              const userResponse = await getUser();
              if (userResponse.data && userResponse.data.data) {
                // Store user data in localStorage for role-based access control
                localStorage.setItem('user', JSON.stringify(userResponse.data.data));
              }
            } catch (userError) {
              console.error('Failed to fetch user data:', userError);
              // Continue without user data - will default to 'user' role
            }

            const resCode = localStorage.getItem('originalCode');

            if (resCode) {
              localStorage.removeItem('originalCode');
              navigate(`/form?code=${resCode}`);
            }else {
              navigate(`/`);
            }
          } else {
            navigate(`/`);
          }
        } catch (error) {
          console.error(error);
          navigate(`/`);
        }
    };

    redirectAuthAPI();
  }, [code, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      {/* Main Card Container */}
      <Card className="w-full max-w-md p-8 text-center space-y-8 transition-all duration-300 hover:shadow-xl animate-fade-in border-2 border-[#FF4B28] relative">
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
              className="w-6 h-12 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Redirect;
