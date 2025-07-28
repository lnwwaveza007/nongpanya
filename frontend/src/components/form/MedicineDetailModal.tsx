import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Medicine } from "@/types/medicine";
import { useTranslation } from "react-i18next";
import { Pill, Info, AlertTriangle } from "lucide-react";

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
              {medicine.image_url ? (
                <img
                  src={medicine.image_url}
                  alt={medicine.name}
                  className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiByeD0iMTIiIGZpbGw9IiNGOUZBRkIiLz4KPHA+aCBkPSJNNDggMzBINTRWNDJINDJWMzBINDhaIiBmaWxsPSIjRjU5RTBCIi8+CjxwYXRoIGQ9Ik00MiA1NEg2NlY0Mkg0MlY1NFoiIGZpbGw9IiNGNTlFMEIiLz4KPC9zdmc+";
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center border-2 border-orange-300">
                  <Pill size={32} className="text-orange-600" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {medicine.name}
              </h2>

              <div className="flex items-center gap-2 mb-3">
                <span className="bg-gradient-to-r from-[#FF4B28]/10 to-[#FF6B48]/10 text-[#FF4B28] px-3 py-1 rounded-full text-sm font-medium">
                  {t("medicineModal.available")}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {t("medicineModal.overthecounter")}
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
                {medicine.description}
              </p>
            </div>
          )}
        </div>

        {/* Medical Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <AlertTriangle size={18} className="text-yellow-600" />
            {t("medicineModal.disclaimer.title")}
          </h3>
          <p className="text-sm text-yellow-700">
            {t("medicineModal.disclaimer.description")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicineDetailModal;
