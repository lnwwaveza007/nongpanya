import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageToggle from "@/components/ui/language-toggle";

import { config } from '../config';
import { useEffect } from "react";
import { auth } from "@/api/auth";
import { getUser } from "@/api/user";

const LoginPage = () => {
  const { t } = useTranslation();

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await auth();
        if (response.data.success) {
          // Fetch and store user data for role-based access control
          try {
            const userResponse = await getUser();
            if (userResponse.data && userResponse.data.data) {
              localStorage.setItem('user', JSON.stringify(userResponse.data.data));
            }
          } catch (userError) {
            console.error('Failed to fetch user data:', userError);
          }
          
          window.location.href = `/form?code=${code}`;
        } else {
          window.location.href = "/";
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        window.location.href = "/";
      }
    };
    
    if (code) {
      verifyAuth();
    }
  }, [code]);

  const primaryColor = "hsl(34, 100%, 56%)";
  const secondaryColor = "hsl(48, 100%, 57%)";

  const handleLogin = () => {
    window.location.href = `${
      config.api.url
    }/auth/microsoft`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Language Toggle */}
      <LanguageToggle variant="floating" />
      
      {/* Main Card Container */}
      <Card className="w-full max-w-md p-8 text-center space-y-8 transition-all duration-300 hover:shadow-xl animate-fade-in border-[#FF4B28]">
        {/* Animated Face */}
        <div className="text-center">
          <div
            className="text-6xl font-bold transition-all duration-300 hover:scale-110 cursor-pointer mb-4"
            style={{ color: "#FF4B28" }}
          >
            (✧ω✧)
          </div>
          <h1
            className="text-3xl font-bold animate-bounce"
            style={{ color: "#FF4B28" }}
          >
            {t("welcome.title")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("login.subtitle")}
          </p>
        </div>

        {/* Login Button*/}
        <div className="pt-4">
          <Button
            onClick={handleLogin}
            className="w-full py-6 text-lg transition-all duration-300 hover:scale-105 animate-bounce-slow flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="animate-pulse" />
            <span>{t("login.loginButton")}</span>
          </Button>
        </div>

        {/* Floating Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce-slow text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                opacity: 0.3,
                color: i % 2 === 0 ? primaryColor : secondaryColor,
              }}
            >
              ✧
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
