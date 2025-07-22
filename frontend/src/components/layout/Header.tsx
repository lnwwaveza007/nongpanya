import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  activePage?: "medicine" | "user-log";
}

const Header: React.FC<HeaderProps> = ({ activePage = "medicine" }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-orange-600 text-white px-6 py-4 flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <span className="font-bold text-xl text-white">NongPanya</span>
        <Button 
          variant="link" 
          className={`text-white underline-offset-4 ${activePage === "medicine" ? "" : "text-white/70 hover:text-white"} bg-orange-600 border border-white rounded-md px-2 py-1`}
          onClick={() => navigate('/dashboard')}
        >
          Medicine
        </Button>
        <Button 
          variant="link" 
          className={`text-white underline-offset-4 ${activePage === "user-log" ? "" : "text-white/70 hover:text-white"} bg-orange-600 border border-white rounded-md px-2 py-1`}
          onClick={() => navigate('/user-log')}
        >
          User log
        </Button>
      </div>
    </div>
  );
};

export default Header; 