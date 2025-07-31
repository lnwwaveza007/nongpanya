import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Home, Pill, Users, LogOut } from "lucide-react";
import { signOut } from "@/api/auth";

interface HeaderProps {
  activePage?: "dashboard" | "user-log";
}

const Header: React.FC<HeaderProps> = ({ activePage = "dashboard" }) => {
  const navigate = useNavigate();
  const { hasMinimumRole } = useAuth();

  // Check if user has admin access
  const hasAdminAccess = hasMinimumRole('admin');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      window.location.href = "/";
    }
  };

  return (
    <div className="bg-white border-b-4 border-[#FF4B28] shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          {/* Logo and Navigation */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate('/home')}>
              <div className="text-2xl sm:text-3xl" style={{ color: "#FF4B28" }}>
                (✧ω✧)
              </div>
              <span className="font-bold text-xl sm:text-2xl text-[#FF4B28]">NongPanya</span>
            </div>
            
            {/* Navigation */}
            {hasAdminAccess && (
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center sm:justify-start">
                <Button 
                  size="sm"
                  variant={activePage === "dashboard" ? "default" : "outline"}
                  className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 ${
                    activePage === "dashboard" 
                      ? "bg-[#FF4B28] hover:bg-[#FF4B28]/90 text-white border-[#FF4B28]" 
                      : "border-2 border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white"
                  }`}
                  onClick={() => navigate('/dashboard')}
                >
                  <Pill size={14} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden xs:inline">Medicine Dashboard</span>
                  <span className="xs:hidden">Dashboard</span>
                </Button>
                <Button 
                  size="sm"
                  variant={activePage === "user-log" ? "default" : "outline"}
                  className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 ${
                    activePage === "user-log" 
                      ? "bg-[#FF4B28] hover:bg-[#FF4B28]/90 text-white border-[#FF4B28]" 
                      : "border-2 border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white"
                  }`}
                  onClick={() => navigate('/user-log')}
                >
                  <Users size={14} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden xs:inline">User Logs</span>
                  <span className="xs:hidden">Logs</span>
                </Button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              onClick={() => navigate('/home')}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 sm:gap-2 border-2 border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white text-xs sm:text-sm px-2 sm:px-4"
            >
              <Home size={14} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 sm:gap-2 border-2 border-[#FF4B28] text-[#FF4B28] hover:bg-[#FF4B28] hover:text-white text-xs sm:text-sm px-2 sm:px-4"
            >
              <LogOut size={14} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 