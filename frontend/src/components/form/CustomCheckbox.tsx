import React from 'react';
import { Card } from '@/components/ui/card';

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
  return (
    // Symptoms Checklist
    <div className="mx-auto flex flex-col space-y-6">
      {symptomsList.map((symptom) => (
        <Card
          key={symptom.id}
          className="p-6 transition-all duration-300 hover:shadow-xl"
          style={{ borderColor: '#FF4B28' }}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id={symptom.id}
                checked={symptoms.includes(symptom.id)}
                onChange={() => handleSymptomToggle(symptom.id)}
              />
              <div className="text-3xl" style={{ color: '#FF4B28' }}>
                {symptom.icon}
              </div>
              <label htmlFor={symptom.id} className="text-xl font-semibold cursor-pointer">
                {symptom.name}
              </label>
            </div>

          </div>
        </Card>
      ))}
    </div>
  );
}

export default CustomCheckbox;