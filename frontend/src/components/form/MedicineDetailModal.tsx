import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Medicine } from "@/types/medicine";
import { useTranslation } from "react-i18next";
import { Pill, Info, AlertCircle } from "lucide-react";
import MedicineImage from "@/components/ui/medicine-image";
import { getMedInfo } from "@/api/med";

interface MedicineDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
}

interface MedicineInstruction {
  id: number;
  medicine_id: number;
  content: string;
  type: 'Instruction' | 'Warning' | 'Side_Effect';
}

const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  isOpen,
  onClose,
  medicine,
}) => {
  const { t } = useTranslation();
  const [instructions, setInstructions] = useState<MedicineInstruction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMedicineInstructions = async () => {
      if (!medicine) return;
      
      setLoading(true);
      try {
        const response = await getMedInfo(medicine.id);
        if (response.data.success) {
          setInstructions(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch medicine instructions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (medicine && isOpen) {
      fetchMedicineInstructions();
    }
  }, [medicine, isOpen]);

  if (!medicine) return null;

  const instructionsList = instructions.filter(item => item.type === 'Instruction');
  const warningsList = instructions.filter(item => item.type === 'Warning');
  const sideEffectsList = instructions.filter(item => item.type === 'Side_Effect');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#FF4B28] flex items-center gap-2">
            <Pill className="text-[#FF4B28]" size={24} />
            {t("medicineModal.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Medicine Header */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-shrink-0">
              <MedicineImage
                medicine={medicine}
                size="xl"
                showGrayscale={true}
                className="border-2 border-gray-100"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {medicine.name}
              </h2>

              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`${
                    medicine.total_stock === 0 ? "bg-red-100" : "bg-green-100"
                  } ${
                    medicine.total_stock === 0
                      ? "text-red-600"
                      : "text-green-600"
                  } px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {medicine.total_stock === 0
                    ? t("homepage.availableMedicines.outOfStock")
                    : `${t("homepage.availableMedicines.available")}`}
                </span>
              </div>
            </div>
          </div>

          {/* Medicine Description */}
          {medicine.description && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Info size={18} className="text-blue-500" />
                {t("medicineModal.description")}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {t(`medicineDescription.${medicine.id}`)}
              </p>
            </div>
          )}

          {/* Instructions Section */}
          {instructionsList.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Info size={18} className="text-blue-500" />
                {t("result.instructions")}
              </h3>
              <ul className="space-y-2">
                {instructionsList.map((instruction) => (
                  <li key={instruction.id} className="flex items-start text-blue-700">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span className="text-sm leading-relaxed">{t(`detail.${instruction.id}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings Section */}
          {warningsList.length > 0 && (
            <div className="bg-red-50 rounded-xl p-4">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500" />
                {t("result.warnings")}
              </h3>
              <ul className="space-y-2">
                {warningsList.map((warning) => (
                  <li key={warning.id} className="flex items-start text-red-700">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span className="text-sm leading-relaxed">{t(`detail.${warning.id}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Side Effects Section */}
          {sideEffectsList.length > 0 && (
            <div className="bg-orange-50 rounded-xl p-4">
              <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <AlertCircle size={18} className="text-orange-500" />
                {t("result.sideEffects")}
              </h3>
              <ul className="space-y-2">
                {sideEffectsList.map((sideEffect) => (
                  <li key={sideEffect.id} className="flex items-start text-orange-700">
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span className="text-sm leading-relaxed">{t(`detail.${sideEffect.id}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4B28] mx-auto"></div>
              <p className="text-gray-500 mt-2 text-sm">{t("medicineModal.loading")}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicineDetailModal;
