// Form-related interfaces
export interface InputProps {
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  icon?: React.ReactNode;
}

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export interface CheckboxComponentProps {
  symptoms: Symptom[];
  selectedSymptoms: number[];
  onSymptomChange: (symptomId: number, checked: boolean) => void;
}

export interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onAccept: () => void;
}

export interface ModalBoxProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; quantity: number; expiry_date: string }) => void;
}

export interface EditStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockEntry;
  onSubmit: (data: { name: string; quantity: number; expiry_date: string }) => void;
}

export interface UserLogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLog: UserLog;
}

export interface HeaderProps {
  activePage?: string;
}

// Import dependencies
import { Symptom, StockEntry, UserLog } from './medicine'; 