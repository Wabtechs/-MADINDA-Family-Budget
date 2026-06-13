export interface User {
  id: number;
  nom: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin' | 'manager' | 'viewer';
  avatar: string | null;
  phone: string | null;
  email_verified_at: Date | null;
  is_active: number;
  created_at: Date;
  updated_at: Date;
}

export interface Entity {
  id: number;
  name: string;
  type: 'family' | 'company' | 'association' | 'organization' | 'other';
  description: string | null;
  logo: string | null;
  currency: string;
  timezone: string;
  owner_id: number;
  is_active: number;
  created_at: Date;
  updated_at: Date;
}

export interface EntityMember {
  id: number;
  entity_id: number;
  user_id: number;
  role: 'admin' | 'manager' | 'viewer';
  status: 'pending' | 'accepted' | 'rejected';
  invited_at: Date;
  joined_at: Date | null;
  created_at: Date;
}

export interface Account {
  id: number;
  entity_id: number;
  name: string;
  type: 'bank' | 'mobile_money' | 'cash' | 'investment' | 'other';
  balance: number;
  currency: string;
  account_number: string | null;
  bank_name: string | null;
  description: string | null;
  is_active: number;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  entity_id: number | null;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  parent_id: number | null;
  is_active: number;
  created_at: Date;
}

export interface Income {
  id: number;
  entity_id: number;
  account_id: number;
  category_id: number;
  user_id: number;
  amount: number;
  source: string | null;
  description: string | null;
  date: string;
  is_recurring: number;
  recurring_interval: string | null;
  recurring_end_date: string | null;
  attachment_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Expense {
  id: number;
  entity_id: number;
  account_id: number;
  category_id: number;
  user_id: number;
  amount: number;
  description: string | null;
  date: string;
  is_recurring: number;
  recurring_interval: string | null;
  recurring_end_date: string | null;
  attachment_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Transfer {
  id: number;
  entity_id: number;
  from_account_id: number;
  to_account_id: number;
  user_id: number;
  amount: number;
  description: string | null;
  date: string;
  created_at: Date;
}

export interface Transaction {
  id: number;
  entity_id: number;
  account_id: number;
  user_id: number;
  type: 'income' | 'expense' | 'transfer_in' | 'transfer_out';
  reference_type: string;
  reference_id: number;
  amount: number;
  description: string | null;
  date: string;
  created_at: Date;
}

export interface Budget {
  id: number;
  entity_id: number;
  category_id: number | null;
  name: string;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  start_date: string;
  end_date: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Goal {
  id: number;
  entity_id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  status: 'in_progress' | 'completed' | 'cancelled';
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Debt {
  id: number;
  entity_id: number;
  type: 'owed_to_us' | 'we_owe';
  contact_name: string;
  amount: number;
  remaining_amount: number;
  description: string | null;
  due_date: string | null;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  created_at: Date;
  updated_at: Date;
}

export interface DebtPayment {
  id: number;
  debt_id: number;
  amount: number;
  payment_date: string;
  note: string | null;
  created_at: Date;
}

export interface Notification {
  id: number;
  user_id: number;
  entity_id: number | null;
  type: string;
  title: string;
  message: string;
  is_read: number;
  read_at: Date | null;
  created_at: Date;
}

export interface Document {
  id: number;
  entity_id: number;
  user_id: number;
  name: string;
  type: 'invoice' | 'receipt' | 'contract' | 'statement' | 'other';
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  description: string | null;
  created_at: Date;
}

export interface AuditLog {
  id: number;
  user_id: number;
  entity_id: number | null;
  action: string;
  resource_type: string;
  resource_id: number | null;
  details: unknown;
  ip_address: string | null;
  created_at: Date;
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export interface DashboardData {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyProfit: number;
  recentTransactions: Transaction[];
  topCategories: { category_name: string; total: number; percentage: number }[];
  monthlyComparison: { month: string; income: number; expense: number }[];
  budgetStatus: { name: string; amount: number; spent: number; percentage: number; status: string }[];
  accountSummary: { id: number; name: string; type: string; balance: number }[];
}

export interface MonthlyReport {
  month: string;
  income: number;
  expense: number;
  profit: number;
}

export interface CategoryReport {
  category_id: number;
  category_name: string;
  icon: string;
  total: number;
  count: number;
  percentage: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
