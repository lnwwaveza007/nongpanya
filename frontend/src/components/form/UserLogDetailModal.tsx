import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Mail, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import MedicineImage from "@/components/ui/medicine-image";
import { getTranslatedSymptomName } from '@/utils/symptomTranslations';

interface UserLogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: {
    code: string;
    user_id: string;
    fullname: string;
    email: string;
    additional_notes: string;
    allergies: string;
    status: string;
    created_at: string;
    updated_at: string;
    medicines: Array<{
      id: number;
      name: string;
      image_url: string | null;
      description: string | null;
    }>;
    symptoms: Array<{
      id: number;
      name: string;
      description: string;
    }>;
  };
}

const UserLogDetailModal: React.FC<UserLogDetailModalProps> = ({ isOpen, onClose, log }) => {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[80%] max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-[#FF4B28] flex items-center gap-3">
            <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
              <User className="text-orange-600" size={20} />
            </div>
            <div>
              <span>{t('userLogDetail.requestDetails')}</span>
              <p className="text-xs sm:text-sm text-gray-500 font-normal">{t('userLogDetail.code')}: {log.code}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* User Information */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <User className="text-gray-400" size={16} />
                <div>
                  <div className="text-xs sm:text-sm text-gray-500">{t('userLogDetail.fullName')}</div>
                  <div className="text-sm sm:text-base font-medium">{log.fullname}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Mail className="text-gray-400" size={16} />
                <div>
                  <div className="text-xs sm:text-sm text-gray-500">{t('userLogDetail.email')}</div>
                  <div className="text-sm sm:text-base font-medium">{log.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Clock className="text-gray-400" size={16} />
                <div>
                  <div className="text-xs sm:text-sm text-gray-500">{t('userLogDetail.requestedAt')}</div>
                  <div className="text-sm sm:text-base font-medium">{formatDate(log.created_at)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {log.status === "completed" ? (
                  <CheckCircle2 className="text-green-400" size={16} />
                ) : (
                  <AlertCircle className="text-yellow-400" size={16} />
                )}
                <div>
                  <div className="text-xs sm:text-sm text-gray-500">{t('userLogDetail.status')}</div>
                  <div className={`text-sm sm:text-base font-medium ${
                    log.status === "completed" ? "text-green-600" : "text-yellow-600"
                  }`}>
                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-3">{t('userLogDetail.symptoms')}</h3>
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {log.symptoms.map((symptom) => (
                <div key={symptom.id} className="bg-orange-50 p-3 sm:p-4 rounded-lg border-2 border-orange-200">
                  <div className="font-medium text-[#FF4B28] text-sm sm:text-base">{getTranslatedSymptomName(symptom.name, t)}</div>
                  <div className="text-xs sm:text-sm text-orange-600 mt-1">{symptom.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Medicines */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-3">{t('userLogDetail.prescribedMedicines')}</h3>
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {log.medicines.map((medicine) => (
                <div key={medicine.id} className="bg-orange-50 p-3 sm:p-4 rounded-lg border-2 border-orange-200">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0">
                      <MedicineImage
                        medicine={medicine}
                        size="sm"
                        className="border-2 bg-white"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-[#FF4B28] text-sm sm:text-base">{medicine.name}</div>
                      <div className="text-xs sm:text-sm text-orange-600 mt-1">{medicine.description ? t('medicineDescription.'+medicine.id) : t('userLogDetail.noDescriptionAvailable')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medicines */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">{t('userLogDetail.prescribedMedicines')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {log.medicines.map((medicine) => (
                <div key={medicine.id} className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <MedicineImage
                        medicine={medicine}
                        size="md"
                        className="border bg-white"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-blue-700">{medicine.name}</div>
                      <div className="text-sm text-blue-600 mt-1">{medicine.description ? t('medicineDescription.'+medicine.id) : t('userLogDetail.noDescriptionAvailable')}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes and Allergies */}
          <div className="space-y-3 sm:space-y-4">
            {log.additional_notes && (
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">{t('userLogDetail.additionalNotes')}</h3>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-gray-700 text-sm sm:text-base">
                  {log.additional_notes}
                </div>
              </div>
            )}
            {log.allergies && (
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">{t('userLogDetail.allergies')}</h3>
                <div className="bg-red-50 p-3 sm:p-4 rounded-lg text-red-700 text-sm sm:text-base border-2 border-red-200">
                  {log.allergies}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserLogDetailModal; 