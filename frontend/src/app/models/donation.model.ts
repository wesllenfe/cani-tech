export interface Donation {
  id: number;
  category_id: number;
  title: string;
  description: string | null;
  amount: number;
  donor_name: string;
  donor_email: string | null;
  date: string;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
    type: 'donation';
  };
}
