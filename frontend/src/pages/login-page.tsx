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
          
          // Get the current URL parameters fresh inside the effect
          const currentParams = new URLSearchParams(window.location.search);
          const currentCode = currentParams.get("code");
          // If user has a code, redirect to form page, otherwise redirect to homepage
          if (currentCode && currentCode.trim() !== '') {
            window.location.href = `/form?code=${currentCode}`;
          } else {
            window.location.href = "/home";
          }
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
      }
    };
    
    // Check auth status when component loads
    verifyAuth();
  }, []); // Remove code dependency to prevent unnecessary re-runs

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
      <Card className="w-full max-w-md p-8 text-center space-y-8 transition-all duration-300 hover:shadow-xl animate-fade-in border-2 border-[#FF4B28]">
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

        {/* Email Requirement Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                {t("login.emailRequirement").split('@ad.sit.kmutt.ac.th').map((part, index, array) => (
                   <span key={index}>
                     {part}
                     {index < array.length - 1 && (
                       <span className="font-bold text-blue-900 bg-yellow-200 px-1 rounded">
                         @ad.sit.kmutt.ac.th
                       </span>
                     )}
                   </span>
                 ))}
              </p>
            </div>
          </div>
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
