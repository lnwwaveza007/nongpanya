import React from 'react';
import { Card } from '@/components/ui/card';
import { useSymptomTranslation } from '@/hooks/useSymptomTranslation';
import { useTranslation } from "react-i18next";
import { HeartPulse } from 'lucide-react';

interface CheckboxProps {
  label: string;
}

interface Symptom {
  id: string;
  icon: React.ReactNode;
  name: string;
}

interface CheckboxComponentProps {
  checkboxprops: CheckboxProps;
  symptomsList: Symptom[];
  symptoms: string[];
  handleSymptomToggle: (id: string) => void;
}

const CustomCheckbox: React.FC<CheckboxComponentProps> = ({ symptomsList, symptoms, handleSymptomToggle }) => {
  const { translateSymptom } = useSymptomTranslation();
  const { t } = useTranslation();

  return (
    <Card className="p-6 bg-white rounded-xl shadow-lg border-2 border-primary">
      <div className="flex items-center gap-2 mb-4">
        <HeartPulse className="text-primary" size={24} />
        <h3 className="text-lg font-semibold text-primary">{t("form.symptoms")}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {symptomsList.map((symptom) => (
          <div
            key={symptom.id}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <input
              type="checkbox"
              id={symptom.id}
              checked={symptoms.includes(symptom.id)}
              onChange={() => handleSymptomToggle(symptom.id)}
              className="w-5 h-5 text-[#FF4B28] border-2 border-gray-300 rounded focus:ring-[#FF4B28] focus:ring-2 cursor-pointer"
            />
            <div className="text-xl" style={{ color: '#FF4B28' }}>
              {symptom.icon}
            </div>
            <label 
              htmlFor={symptom.id} 
              className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
            >
              {translateSymptom(symptom.name)}
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default CustomCheckbox;