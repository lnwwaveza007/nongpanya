import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ checked, onChange }) => {
  const { t } = useTranslation();
  
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
            {t('terms.title')}
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#FF4B28' }} />
              <span className="text-gray-700 text-sm">
                {t('terms.warning1')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#FF4B28' }} />
              <span className="text-gray-700 text-sm">
                {t('terms.warning2')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#FF4B28' }} />
              <span className="text-gray-700 text-sm">
                {t('terms.warning3')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#FF4B28' }} />
              <span className="text-gray-700 text-sm">
                {t('terms.warning4')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TermsCheckbox;
