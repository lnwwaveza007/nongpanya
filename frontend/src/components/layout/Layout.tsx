import React from "react";
import BugSuggestionButton from "../ui/bug-suggestion-button";

interface LayoutProps {
  children: React.ReactNode;
  showBugButton?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showBugButton = true }) => {
  return (
    <div className="min-h-screen relative">
      {children}
      {showBugButton && <BugSuggestionButton />}
    </div>
  );
};

export default Layout; 