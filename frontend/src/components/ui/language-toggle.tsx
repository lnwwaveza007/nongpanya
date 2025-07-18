import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  variant?: "default" | "floating" | "inline";
  size?: "default" | "sm" | "lg";
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

const LanguageToggle = ({
  variant = "default",
  size = "sm",
  className,
  showIcon = true,
  showText = true,
}: LanguageToggleProps) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "th" ? "en" : "th";
    i18n.changeLanguage(newLang);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "floating":
        return "fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm hover:bg-white";
      case "inline":
        return "bg-transparent hover:bg-gray-100";
      default:
        return "bg-white/90 backdrop-blur-sm hover:bg-white";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "lg":
        return "px-4 py-2 text-base";
      case "default":
        return "px-3 py-1.5 text-sm";
      default:
        return "px-2 py-1 text-xs";
    }
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size={size}
      className={cn(
        "flex items-center gap-2 transition-all duration-200",
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
    >
      {showIcon && <Globe className={cn(size === "lg" ? "w-5 h-5" : size === "default" ? "w-4 h-4" : "w-3 h-3")} />}
      {showText && (
        <span className="font-medium">
          {i18n.language === "th" ? "EN" : "TH"}
        </span>
      )}
    </Button>
  );
};

export default LanguageToggle; 