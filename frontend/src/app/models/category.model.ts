export enum CategoryType {
  EXPENSE = 'expense',
  DONATION = 'donation'
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  type: CategoryType;
  created_at: string;
  updated_at: string;
}
