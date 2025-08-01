import React from "react";
import { HeartPulse, Pill } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TabSelectorProps {
  activeTab: "symptoms" | "medicines";
  onTabChange: (tab: "symptoms" | "medicines") => void;
  symptomsCount: number;
  medicinesCount: number;
}

const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  onTabChange,
  symptomsCount,
  medicinesCount,
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <div className="flex">
        <button
          onClick={() => onTabChange("symptoms")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all duration-200 ${
            activeTab === "symptoms"
              ? "bg-primary text-white border-b-2 border-primary"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          <HeartPulse size={16} />
          <span className="font-medium text-sm">{t("form.symptoms")}</span>
          {symptomsCount > 0 && (
            <span className="bg-white text-primary rounded-full px-1.5 py-0.5 text-xs font-bold min-w-[18px] text-center">
              {symptomsCount}
            </span>
          )}
        </button>
        
        <button
          onClick={() => onTabChange("medicines")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all duration-200 ${
            activeTab === "medicines"
              ? "bg-primary text-white border-b-2 border-primary"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Pill size={16} />
          <span className="font-medium text-sm">{t("form.medicines")}</span>
          {medicinesCount > 0 && (
            <span className="bg-white text-primary rounded-full px-1.5 py-0.5 text-xs font-bold min-w-[18px] text-center">
              {medicinesCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default TabSelector; 