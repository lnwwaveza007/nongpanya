import React from 'react';
import { Card } from '../ui/card';

interface InputProps {
  icon: React.ReactNode;
  type: string;
  name: string;
  placeholder: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  readOnly?: boolean;
}

const CustomInput = (InputProps: InputProps) => (
  <Card className="p-4 rounded-lg bg-white hover:bg-gray-50 transition-all flex items-center gap-2" style={{ borderColor: '#FF4B28' }}>
    <div className="text-gray-400">
      {InputProps.icon}
    </div>
    <input
      type={InputProps.type}
      name={InputProps.name}
      placeholder={InputProps.placeholder}
      value={InputProps.value || ''}
      onChange={InputProps.onChange}
      readOnly={InputProps.readOnly}
      className={`w-full ${InputProps.readOnly ? 'bg-gray-100' : 'bg-white'} p-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400`}
    />
  </Card>
);

const CustomTextArea = ({ name, placeholder, value, onChange }: Omit<InputProps, 'type' | 'icon'>) => (
  <Card className="p-4 rounded-lg bg-white hover:bg-gray-50 transition-all" style={{ borderColor: '#FF4B28' }}>
    <textarea
      id={name}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-white p-3 rounded-lg border border-gray-400 focus:ring-2 focus:ring-blue-500 transition-all h-32 placeholder-gray-400 resize-none"
    />
  </Card>
);

export {CustomInput, CustomTextArea};