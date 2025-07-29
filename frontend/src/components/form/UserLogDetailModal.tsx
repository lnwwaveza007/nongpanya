import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Mail, Weight, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import MedicineImage from "@/components/ui/medicine-image";

interface UserLogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: {
    code: string;
    user_id: string;
    fullname: string;
    email: string;
    weight: string;
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#FF4B28] flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <User className="text-orange-600" size={24} />
            </div>
            <div>
              <span>Request Details</span>
              <p className="text-sm text-gray-500 font-normal">Code: {log.code}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-6">
          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="text-gray-400" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Full Name</div>
                  <div className="font-medium">{log.fullname}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{log.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Weight className="text-gray-400" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Weight</div>
                  <div className="font-medium">{log.weight} kg</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="text-gray-400" size={20} />
                <div>
                  <div className="text-sm text-gray-500">Requested At</div>
                  <div className="font-medium">{formatDate(log.created_at)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {log.status === "completed" ? (
                  <CheckCircle2 className="text-green-400" size={20} />
                ) : (
                  <AlertCircle className="text-yellow-400" size={20} />
                )}
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className={`font-medium ${
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
            <h3 className="text-lg font-medium text-gray-800 mb-3">Symptoms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {log.symptoms.map((symptom) => (
                <div key={symptom.id} className="bg-orange-50 p-4 rounded-lg">
                  <div className="font-medium text-orange-700">{symptom.name}</div>
                  <div className="text-sm text-orange-600 mt-1">{symptom.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Medicines */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Prescribed Medicines</h3>
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
                      <div className="text-sm text-blue-600 mt-1">{medicine.description || "No description available"}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes and Allergies */}
          <div className="space-y-4">
            {log.additional_notes && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Additional Notes</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
                  {log.additional_notes}
                </div>
              </div>
            )}
            {log.allergies && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Allergies</h3>
                <div className="bg-red-50 p-4 rounded-lg text-red-700">
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