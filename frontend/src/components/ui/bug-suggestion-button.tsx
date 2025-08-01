import React from "react";
import { Button } from "./button";
import { MessageSquare } from "lucide-react";

interface BugSuggestionButtonProps {
  className?: string;
}

const BugSuggestionButton: React.FC<BugSuggestionButtonProps> = ({ className }) => {
  const handleClick = () => {
    // Open the Google Form in a new tab
    window.open("https://forms.gle/jzSLScqqrjaHouBz9", "_blank");
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className || ""}`}>
      <Button
        onClick={handleClick}
        className="bg-[#FF4B28] hover:bg-[#FF4B28]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full h-14 w-14 p-0 flex items-center justify-center group"
        title="Report Bug or Suggest Feature"
      >
        <div className="flex flex-col items-center gap-1">
          <MessageSquare size={16} className="group-hover:scale-110 transition-transform duration-200" />
        </div>
      </Button>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Report Bug or Suggest Feature
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};

export default BugSuggestionButton; 