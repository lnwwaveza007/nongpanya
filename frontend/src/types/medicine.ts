// Medicine-related interfaces
export interface Medicine {
  id: number;
  name: string;
  image_url: string;
  description: string;
}

export interface Symptom {
  id: number;
  name: string;
  description: string;
}

export interface Medical {
  imageUrl: string;
  name: string;
  type: string;
  quantity: number;
  frequency: number;
  instructions: unknown[];
  warnings: unknown[];
}

export interface StockEntry {
  id: number;
  name: string;
  quantity: number;
  expiry_date: string;
}

export interface MedRanking {
  name: string;
  count: number;
}

export interface MedRequest {
  time: string;
  medicine: MedTimeseriesMed[];
}

export interface MedTimeseriesMed {
  medicine_id: string;
  medicine_name: string;
  total: number;
}

export interface UserLog {
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
  medicines: Medicine[];
  symptoms: Symptom[];
} 