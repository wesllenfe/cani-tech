export interface AdoptionRequest {
  id: number;
  animal_id: number;
  user_id: number;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  created_at: string;
  updated_at: string;
  animal?: {
    id: number;
    name: string;
    photo_url?: string;
    breed?: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateAdoptionRequest {
  message: string;
}