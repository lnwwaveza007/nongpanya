import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Medicine } from "@/types/medicine";
import { useTranslation } from "react-i18next";
import { Pill, Info } from "lucide-react";
import MedicineImage from "@/components/ui/medicine-image";

interface MedicineDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
}

const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  isOpen,
  onClose,
  medicine,
}) => {
  const { t } = useTranslation();

  if (!medicine) return null;

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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicineDetailModal;
