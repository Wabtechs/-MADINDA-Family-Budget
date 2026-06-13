export interface User {
  id: number;
  nom: string;
  email: string;
  password: string;
  role: 'admin' | 'member';
  created_at: Date;
}

export interface Family {
  id: number;
  nom_famille: string;
  created_at: Date;
}

export interface FamilyMember {
  id: number;
  user_id: number;
  family_id: number;
}

export interface Category {
  id: number;
  nom: string;
  icone: string;
  type: 'income' | 'expense';
  created_at: Date;
}

export interface Expense {
  id: number;
  family_id: number;
  user_id: number;
  category_id: number;
  montant: number;
  description: string | null;
  date: string;
  created_at: Date;
}

export interface Budget {
  id: number;
  family_id: number;
  category_id: number | null;
  montant: number;
  periode: 'weekly' | 'monthly' | 'yearly';
  date_debut: string | null;
  date_fin: string | null;
  created_at: Date;
}

export interface Notification {
  id: number;
  user_id: number;
  message: string;
  status: 'unread' | 'read';
  created_at: Date;
}

export type UserPublic = Omit<User, 'password'>;

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export interface ExpenseWithRelations extends Expense {
  user_nom: string;
  category_nom: string;
  category_icone: string;
}

export interface DashboardStats {
  total_budget: number;
  total_expenses: number;
  remaining: number;
  expenses_by_category: { category: string; total: number }[];
  monthly_evolution: { month: string; total: number }[];
  recent_expenses: ExpenseWithRelations[];
}
