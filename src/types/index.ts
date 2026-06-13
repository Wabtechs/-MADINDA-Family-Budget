export interface User {
  id: number;
  nom: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  created_at: string;
}

export interface Entity {
  id: number;
  name: string;
  type: string;
  description?: string;
  logo?: string;
  currency: string;
  timezone?: string;
  owner_id: number;
  is_active: boolean;
  created_at: string;
}

export interface Account {
  id: number;
  entity_id: number;
  name: string;
  type: 'checking' | 'savings' | 'cash' | 'credit_card' | 'investment' | 'other';
  balance: number;
  currency: string;
  account_number?: string;
  bank_name?: string;
  description?: string;
  is_active: boolean;
}

export interface Category {
  id: number;
  entity_id: number | null;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
  parent_id: number | null;
}

export interface Income {
  id: number;
  entity_id: number;
  account_id: number;
  user_id: number;
  category_id: number;
  amount: number;
  description?: string;
  date: string;
  created_at: string;
  user_nom?: string;
  category_name?: string;
  category_icon?: string;
  account_name?: string;
}

export interface Expense {
  id: number;
  entity_id: number;
  account_id: number;
  user_id: number;
  category_id: number;
  amount: number;
  description?: string;
  date: string;
  created_at: string;
  user_nom?: string;
  category_name?: string;
  category_icon?: string;
  account_name?: string;
}

export interface Transfer {
  id: number;
  entity_id: number;
  from_account_id: number;
  to_account_id: number;
  user_id: number;
  amount: number;
  description?: string;
  date: string;
  created_at: string;
  from_account_name?: string;
  to_account_name?: string;
}

export interface Transaction {
  id: number;
  entity_id: number;
  account_id: number;
  user_id: number;
  type: 'income' | 'expense' | 'transfer';
  reference_type?: string;
  reference_id?: number;
  amount: number;
  description?: string;
  date: string;
  created_at: string;
}

export interface Budget {
  id: number;
  entity_id: number;
  category_id: number | null;
  name: string;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly' | 'custom';
  start_date: string;
  end_date: string;
}

export interface Goal {
  id: number;
  entity_id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  status: 'in_progress' | 'completed' | 'cancelled';
  description?: string;
}

export interface Debt {
  id: number;
  entity_id: number;
  type: 'lent' | 'borrowed';
  contact_name: string;
  amount: number;
  remaining_amount: number;
  description?: string;
  due_date: string | null;
  status: 'active' | 'paid' | 'overdue';
}

export interface DebtPayment {
  id: number;
  debt_id: number;
  amount: number;
  payment_date: string;
  note: string | null;
}

export interface Notification {
  id: number;
  user_id: number;
  entity_id: number | null;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Document {
  id: number;
  entity_id: number;
  user_id: number;
  name: string;
  type: string;
  file_url: string;
  file_size: number | null;
  description?: string;
}

export interface AuditLog {
  id: number;
  user_id: number;
  entity_id: number | null;
  action: string;
  resource_type: string;
  resource_id: number | null;
  details?: string;
  created_at: string;
}

export interface DashboardData {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyProfit: number;
  recentTransactions: Transaction[];
  topCategories: { category: string; total: number }[];
  monthlyComparison: { month: string; income: number; expense: number }[];
  budgetStatus: { total: number; used: number; remaining: number }[];
  accountSummary: { account: string; balance: number }[];
}

export interface MonthlyReport {
  month: string;
  income: number;
  expense: number;
  profit: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
