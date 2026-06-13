export interface User {
  id: number;
  nom: string;
  email: string;
  role: 'admin' | 'member';
  created_at: string;
}

export interface Family {
  id: number;
  nom_famille: string;
  created_at: string;
}

export interface Category {
  id: number;
  nom: string;
  icone: string;
  type: 'income' | 'expense';
  created_at: string;
}

export interface Expense {
  id: number;
  family_id: number;
  user_id: number;
  category_id: number;
  montant: number;
  description: string | null;
  date: string;
  created_at: string;
  user_nom?: string;
  category_nom?: string;
  category_icone?: string;
}

export interface Budget {
  id: number;
  family_id: number;
  category_id: number | null;
  montant: number;
  periode: 'weekly' | 'monthly' | 'yearly';
  date_debut: string | null;
  date_fin: string | null;
  created_at: string;
}

export interface DashboardStats {
  total_budget: number;
  total_expenses: number;
  remaining: number;
  expenses_by_category: { category: string; total: number }[];
  monthly_evolution: { month: string; total: number }[];
  recent_expenses: Expense[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
}
