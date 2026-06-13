-- MADINDA Family Budget - Database Schema
-- MariaDB

CREATE DATABASE IF NOT EXISTS madinda_budget
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE madinda_budget;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'member') NOT NULL DEFAULT 'member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- Families table
CREATE TABLE IF NOT EXISTS families (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom_famille VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Family members (junction table)
CREATE TABLE IF NOT EXISTS family_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  family_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  UNIQUE KEY uk_membership (user_id, family_id)
) ENGINE=InnoDB;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  icone VARCHAR(50) DEFAULT '📦',
  type ENUM('income', 'expense') NOT NULL DEFAULT 'expense',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  family_id INT NOT NULL,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  montant DECIMAL(10,2) NOT NULL CHECK (montant > 0),
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  INDEX idx_family_date (family_id, date),
  INDEX idx_user (user_id)
) ENGINE=InnoDB;

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  family_id INT NOT NULL,
  category_id INT DEFAULT NULL,
  montant DECIMAL(10,2) NOT NULL CHECK (montant > 0),
  periode ENUM('weekly', 'monthly', 'yearly') NOT NULL DEFAULT 'monthly',
  date_debut DATE DEFAULT NULL,
  date_fin DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  status ENUM('unread', 'read') NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB;

-- Seed default categories
INSERT INTO categories (nom, icone, type) VALUES
  ('Alimentation', '🛒', 'expense'),
  ('Transport', '🚗', 'expense'),
  ('Logement', '🏠', 'expense'),
  ('Santé', '🏥', 'expense'),
  ('Éducation', '📚', 'expense'),
  ('Loisirs', '🎮', 'expense'),
  ('Vêtements', '👕', 'expense'),
  ('Services publics', '💡', 'expense'),
  ('Assurances', '🛡️', 'expense'),
  ('Salaire', '💰', 'income'),
  ('Revenus divers', '📈', 'income')
ON DUPLICATE KEY UPDATE nom = VALUES(nom);
