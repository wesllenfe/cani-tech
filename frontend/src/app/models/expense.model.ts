export interface Expense {
  id: number;
  category_id: number;
  title: string;
  description: string | null;
  amount: number;
  date: string;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
    type: 'expense';
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
}