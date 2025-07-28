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
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-primary">
      <div className="flex items-center gap-2 mb-4">
        <Pill className="text-primary" size={24} />
        <h3 className="text-lg font-semibold text-primary">
          {t("form.medicines")}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medicinesList.map((medicine) => (
          <div
            key={medicine.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedMedicines.includes(medicine.id.toString())
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-primary/50"
            }`}
            onClick={() => onMedicineToggle(medicine.id.toString())}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedMedicines.includes(medicine.id.toString())}
                onChange={() => onMedicineToggle(medicine.id.toString())}
                className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">
                  {medicine.name}
                </h4>
                {medicine.image_url && (
                  <div className="mb-2">
                    <img
                      src={medicine.image_url}
                      alt={medicine.name}
                      className="w-16 h-16 object-contain rounded border"
                    />
                  </div>
                )}
                {medicine.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {medicine.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {medicinesList.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Pill className="mx-auto mb-2 text-gray-400" size={32} />
          <p>No medicines available</p>
        </div>
      )}
    </div>
  );
};

export default MedicineSelector; 