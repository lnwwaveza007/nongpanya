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
      className=" mx-auto mt-4 p-4 transition-all duration-300 hover:shadow-md border-primary"
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center h-4 mt-1">
          <input
            type="checkbox"
            name='terms'
            checked={checked}
            onChange={onChange}
            required
            className="w-4 h-4"
          />
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold mb-3" style={{ color: '#FF4B28' }}>
            I accept the following terms and conditions:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#FF4B28' }} />
              <span className="text-gray-700 text-sm">
                This system is a preliminary assistant and may contain errors. 🛑
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#FF4B28' }} />
              <span className="text-gray-700 text-sm">
                Using medication without consulting a doctor may affect your health or life. 💊
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#FF4B28' }} />
              <span className="text-gray-700 text-sm">
                I accept all risks that may arise from using this system.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#FF4B28' }} />
              <span className="text-gray-700 text-sm">
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
