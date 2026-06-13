-- MADINDA Family Budget v2 - Complete Financial Management Schema
-- MySQL/MariaDB compatible

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin','admin','manager','viewer') NOT NULL DEFAULT 'manager',
  avatar VARCHAR(500) DEFAULT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  email_verified_at TIMESTAMP NULL DEFAULT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB;

-- Entities (families, companies, associations, organizations)
CREATE TABLE IF NOT EXISTS entities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  type ENUM('family','company','association','organization','other') NOT NULL DEFAULT 'family',
  description TEXT DEFAULT NULL,
  logo VARCHAR(500) DEFAULT NULL,
  currency VARCHAR(10) DEFAULT 'EUR',
  timezone VARCHAR(50) DEFAULT 'UTC',
  owner_id INT NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_owner (owner_id)
) ENGINE=InnoDB;

-- Entity members
CREATE TABLE IF NOT EXISTS entity_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('admin','manager','viewer') NOT NULL DEFAULT 'viewer',
  status ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  joined_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_membership (entity_id, user_id),
  INDEX idx_entity (entity_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- Financial accounts (bank, mobile money, cash, etc.)
CREATE TABLE IF NOT EXISTS accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  type ENUM('bank','mobile_money','cash','investment','other') NOT NULL DEFAULT 'bank',
  balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) DEFAULT 'EUR',
  account_number VARCHAR(100) DEFAULT NULL,
  bank_name VARCHAR(200) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
  INDEX idx_entity (entity_id)
) ENGINE=InnoDB;

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_id INT DEFAULT NULL,
  name VARCHAR(100) NOT NULL,
  type ENUM('income','expense') NOT NULL,
  icon VARCHAR(50) DEFAULT '📦',
  color VARCHAR(7) DEFAULT '#6B7280',
  parent_id INT DEFAULT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_entity (entity_id),
  INDEX idx_type (type),
  INDEX idx_parent (parent_id)
) ENGINE=InnoDB;

-- Incomes
CREATE TABLE IF NOT EXISTS incomes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_id INT NOT NULL,
  account_id INT NOT NULL,
  category_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  source VARCHAR(200) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  date DATE NOT NULL,
  is_recurring TINYINT(1) DEFAULT 0,
  recurring_interval ENUM('daily','weekly','monthly','yearly') DEFAULT NULL,
  recurring_end_date DATE DEFAULT NULL,
  attachment_url VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_entity (entity_id),
  INDEX idx_account (account_id),
  INDEX idx_category (category_id),
  INDEX idx_date (date)
) ENGINE=InnoDB;

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_id INT NOT NULL,
  account_id INT NOT NULL,
  category_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  description TEXT DEFAULT NULL,
  date DATE NOT NULL,
  is_recurring TINYINT(1) DEFAULT 0,
  recurring_interval ENUM('daily','weekly','monthly','yearly') DEFAULT NULL,
  recurring_end_date DATE DEFAULT NULL,
  attachment_url VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_entity (entity_id),
  INDEX idx_account (account_id),
  INDEX idx_category (category_id),
  INDEX idx_date (date)
) ENGINE=InnoDB;

-- Transfers between accounts
CREATE TABLE IF NOT EXISTS transfers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_id INT NOT NULL,
  from_account_id INT NOT NULL,
  to_account_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  description TEXT DEFAULT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
  FOREIGN KEY (from_account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
  FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_entity (entity_id),
  INDEX idx_date (date)
) ENGINE=InnoDB;

-- Centralized transaction ledger
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_id INT NOT NULL,
  account_id INT NOT NULL,
  user_id INT NOT NULL,
  type ENUM('income','expense','transfer_in','transfer_out') NOT NULL,
  reference_type VARCHAR(50) NOT NULL,
  reference_id INT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT DEFAULT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_entity (entity_id),
  INDEX idx_account (account_id),
  INDEX idx_type (type),
  INDEX idx_date (date),
  INDEX idx_reference (reference_type, reference_id)
) ENGINE=InnoDB;

-- Budgets
CREATE TABLE IF NOT EXISTS budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_id INT NOT NULL,
  category_id INT DEFAULT NULL,
  name VARCHAR(200) NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  spent DECIMAL(15,2) DEFAULT 0.00,
  period ENUM('weekly','monthly','quarterly','yearly','custom') NOT NULL DEFAULT 'monthly',
  start_date DATE NOT NULL,
  end_date DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_entity (entity_id),
  INDEX idx_category (category_id)
) ENGINE=InnoDB;

-- Financial goals
CREATE TABLE IF NOT EXISTS goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_id INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  target_amount DECIMAL(15,2) NOT NULL CHECK (target_amount > 0),
  current_amount DECIMAL(15,2) DEFAULT 0.00,
  deadline DATE DEFAULT NULL,
  status ENUM('in_progress','completed','cancelled') NOT NULL DEFAULT 'in_progress',
  description TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
  INDEX idx_entity (entity_id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- Debts
CREATE TABLE IF NOT EXISTS debts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_id INT NOT NULL,
  type ENUM('owed_to_us','we_owe') NOT NULL,
  contact_name VARCHAR(200) NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  remaining_amount DECIMAL(15,2) NOT NULL,
  description TEXT DEFAULT NULL,
  due_date DATE DEFAULT NULL,
  status ENUM('pending','partial','paid','overdue') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
  INDEX idx_entity (entity_id),
  INDEX idx_status (status),
  INDEX idx_due_date (due_date)
) ENGINE=InnoDB;

-- Debt payments
CREATE TABLE IF NOT EXISTS debt_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  debt_id INT NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL,
  note TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (debt_id) REFERENCES debts(id) ON DELETE CASCADE,
  INDEX idx_debt (debt_id)
) ENGINE=InnoDB;

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  entity_id INT DEFAULT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  read_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_user_read (user_id, is_read)
) ENGINE=InnoDB;

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_id INT NOT NULL,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('invoice','receipt','contract','statement','other') NOT NULL DEFAULT 'other',
  file_url VARCHAR(500) NOT NULL,
  file_size INT DEFAULT NULL,
  mime_type VARCHAR(100) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_entity (entity_id),
  INDEX idx_type (type)
) ENGINE=InnoDB;

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  entity_id INT DEFAULT NULL,
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id INT DEFAULT NULL,
  details JSON DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_entity (entity_id),
  INDEX idx_resource (resource_type, resource_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- Password resets
CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- Default categories
INSERT INTO categories (name, type, icon, color, entity_id) VALUES
  ('Salaire', 'income', '💰', '#059669', NULL),
  ('Ventes', 'income', '🛍️', '#2563EB', NULL),
  ('Investissements', 'income', '📈', '#7C3AED', NULL),
  ('Donations', 'income', '🎁', '#D97706', NULL),
  ('Cotisations', 'income', '🤝', '#0891B2', NULL),
  ('Revenus divers', 'income', '📊', '#6B7280', NULL),
  ('Alimentation', 'expense', '🛒', '#EF4444', NULL),
  ('Transport', 'expense', '🚗', '#F97316', NULL),
  ('Logement', 'expense', '🏠', '#EAB308', NULL),
  ('Santé', 'expense', '🏥', '#22C55E', NULL),
  ('Éducation', 'expense', '📚', '#3B82F6', NULL),
  ('Loisirs', 'expense', '🎮', '#A855F7', NULL),
  ('Vêtements', 'expense', '👕', '#EC4899', NULL),
  ('Services publics', 'expense', '💡', '#14B8A6', NULL),
  ('Assurances', 'expense', '🛡️', '#6366F1', NULL),
  ('Maintenance', 'expense', '🔧', '#78716C', NULL),
  ('Autres dépenses', 'expense', '📦', '#6B7280', NULL)
ON DUPLICATE KEY UPDATE name = VALUES(name);
