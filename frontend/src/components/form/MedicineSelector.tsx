import React from "react";
import { Pill } from "lucide-react";
import { Medicine } from "@/types";
import { useTranslation } from "react-i18next";

interface MedicineSelectorProps {
  medicinesList: Medicine[];
  selectedMedicines: string[];
  onMedicineToggle: (medicineId: string) => void;
}

const MedicineSelector: React.FC<MedicineSelectorProps> = ({
  medicinesList,
  selectedMedicines,
  onMedicineToggle,
}) => {
  const { t } = useTranslation();
  
  const handleMedicineToggle = (medicineId: string) => {
    const isCurrentlySelected = selectedMedicines.includes(medicineId);
    
    // If trying to select a new medicine and already have 2 selected, prevent selection
    if (!isCurrentlySelected && selectedMedicines.length >= 2) {
      return;
    }
    
    onMedicineToggle(medicineId);
  };
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-md border border-primary">
      <div className="flex items-center gap-2 mb-3">
        <Pill className="text-primary" size={18} />
        <h3 className="text-base font-semibold text-primary">
          {t("form.medicines")}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {medicinesList.map((medicine) => {
          const isOutOfStock = medicine.total_stock === 0;
          const isSelected = selectedMedicines.includes(medicine.id.toString());
          const canSelect = isSelected || selectedMedicines.length < 2;
          
          return (
            <div
              key={medicine.id}
              className={`border-2 rounded-lg p-3 transition-all duration-200 ${
                isOutOfStock || !canSelect
                  ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                  : `cursor-pointer hover:shadow-md ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary/50"
                    }`
              }`}
              onClick={() => (canSelect && !isOutOfStock) && handleMedicineToggle(medicine.id.toString())}
            >
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  disabled={isOutOfStock || !canSelect}
                  className="mt-1 h-3 w-3 text-primary border-gray-300 rounded focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-medium mb-1 text-sm ${(isOutOfStock || !canSelect) ? "text-gray-500" : "text-gray-900"}`}>
                      {medicine.name}
                    </h4>
                    {isOutOfStock && (
                      <span className="text-xs text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded">
                        Out of Stock
                      </span>
                    )}
                    {!isOutOfStock && !canSelect && !isSelected && (
                      <span className="text-xs text-orange-500 font-medium bg-orange-50 px-1.5 py-0.5 rounded">
                        Max 2 items
                      </span>
                    )}
                  </div>
                  {medicine.image_url && (
                    <div className="mb-2">
                      <img
                        src={medicine.image_url}
                        alt={medicine.name}
                        className={`w-12 h-12 object-contain rounded border ${(isOutOfStock || !canSelect) ? "grayscale" : ""}`}
                      />
                    </div>
                  )}
                  {medicine.description && (
                    <p className={`text-xs line-clamp-2 ${(isOutOfStock || !canSelect) ? "text-gray-400" : "text-gray-600"}`}>
                      {t(`medicineDescription.${medicine.id}`)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {medicinesList.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <Pill className="mx-auto mb-2 text-gray-400" size={24} />
          <p className="text-sm">No medicines available</p>
        </div>
      )}
    </div>
  );
};

export default MedicineSelector; 