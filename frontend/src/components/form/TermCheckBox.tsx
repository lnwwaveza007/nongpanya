import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ checked, onChange }) => {
  return (
    <Card 
      className="max-w-4xl mx-auto mt-6 p-6 transition-all duration-300 hover:shadow-xl"
      style={{ borderColor: '#FF4B28' }}
    >
      <div className="flex items-start gap-4">
        <div className="flex items-center h-5 mt-1">
          <input
            type="checkbox"
            name='terms'
            checked={checked}
            onChange={onChange}
            required
          />
        </div>
        <div className="flex-1">
          <p className="text-xl font-semibold mb-4" style={{ color: '#FF4B28' }}>
            I accept the following terms and conditions:
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" style={{ color: '#FF4B28' }} />
              <span className="text-gray-700">
                This system is a preliminary assistant and may contain errors. 🛑
              </span>
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" style={{ color: '#FF4B28' }} />
              <span className="text-gray-700">
                Using medication without consulting a doctor may affect your health or life. 💊
              </span>
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" style={{ color: '#FF4B28' }} />
              <span className="text-gray-700">
                I accept all risks that may arise from using this system.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" style={{ color: '#FF4B28' }} />
              <span className="text-gray-700">
                I waive the right to claim or sue the manufacturer or service provider for any damages in any case.
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TermsCheckbox;
