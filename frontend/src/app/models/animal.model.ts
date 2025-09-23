export enum AnimalGender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum AnimalSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  EXTRA_LARGE = 'extra_large'
}

export enum AnimalStatus {
  AVAILABLE = 'available',
  ADOPTED = 'adopted',
  UNDER_TREATMENT = 'under_treatment',
  UNAVAILABLE = 'unavailable'
}

export interface Animal {
  id: number;
  name: string;
  breed: string | null;
  age_months: number;
  gender: AnimalGender;
  size: AnimalSize;
  color: string;
  description: string | null;
  status: AnimalStatus;
  vaccinated: boolean;
  neutered: boolean;
  medical_notes: string | null;
  photo_url: string | null;
  weight: number | null;
  entry_date: string;
  created_at: string;
  updated_at: string;
}