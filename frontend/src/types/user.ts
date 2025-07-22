// User-related interfaces
export interface User {
  id: string;
  fullname: string;
  email: string;
  weight?: string;
  allergies?: string;
  additional_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UserQuota {
  maxPerMonth: number;
  used: number;
  resetDate: string;
}

 