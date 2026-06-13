import type { ResultSetHeader } from 'mysql2';
import pool from '../config/database.js';
import type { Expense, ExpenseWithRelations } from '../types/index.js';

export const ExpenseModel = {
  async create(data: Omit<Expense, 'id' | 'created_at'>): Promise<Expense> {
    const [result] = await pool.execute(
      'INSERT INTO expenses (family_id, user_id, category_id, montant, description, date) VALUES (?, ?, ?, ?, ?, ?)',
      [data.family_id, data.user_id, data.category_id, data.montant, data.description ?? null, data.date],
    );
    const insertId = (result as ResultSetHeader).insertId;
    return this.findById(insertId) as Promise<Expense>;
  },

  async findById(id: number): Promise<ExpenseWithRelations | null> {
    const [rows] = await pool.execute(
      `SELECT e.*, u.nom AS user_nom, c.nom AS category_nom, c.icone AS category_icone
       FROM expenses e
       JOIN users u ON e.user_id = u.id
       JOIN categories c ON e.category_id = c.id
       WHERE e.id = ?`,
      [id],
    );
    const expenses = rows as ExpenseWithRelations[];
    return expenses[0] || null;
  },

  async findByFamily(
    familyId: number,
    options?: { startDate?: string; endDate?: string; categoryId?: number; userId?: number; limit?: number; offset?: number },
  ): Promise<ExpenseWithRelations[]> {
    let sql = `SELECT e.*, u.nom AS user_nom, c.nom AS category_nom, c.icone AS category_icone
               FROM expenses e
               JOIN users u ON e.user_id = u.id
               JOIN categories c ON e.category_id = c.id
               WHERE e.family_id = ?`;
    const params: (string | number)[] = [familyId];

    if (options?.startDate) { sql += ' AND e.date >= ?'; params.push(options.startDate); }
    if (options?.endDate) { sql += ' AND e.date <= ?'; params.push(options.endDate); }
    if (options?.categoryId) { sql += ' AND e.category_id = ?'; params.push(options.categoryId); }
    if (options?.userId) { sql += ' AND e.user_id = ?'; params.push(options.userId); }

    sql += ' ORDER BY e.date DESC, e.created_at DESC';

    if (options?.limit) { sql += ' LIMIT ?'; params.push(options.limit); }
    if (options?.offset) { sql += ' OFFSET ?'; params.push(options.offset); }

    const [rows] = await pool.execute(sql, params);
    return rows as ExpenseWithRelations[];
  },

  async update(id: number, data: Partial<Omit<Expense, 'id' | 'created_at'>>): Promise<boolean> {
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.montant !== undefined) { fields.push('montant = ?'); params.push(data.montant); }
    if (data.category_id !== undefined) { fields.push('category_id = ?'); params.push(data.category_id); }
    if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description ?? null); }
    if (data.date !== undefined) { fields.push('date = ?'); params.push(data.date); }

    if (fields.length === 0) return false;

    params.push(id);
    const [result] = await pool.execute(
      `UPDATE expenses SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return (result as ResultSetHeader).affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute('DELETE FROM expenses WHERE id = ?', [id]);
    return (result as ResultSetHeader).affectedRows > 0;
  },

  async getMonthlyStats(familyId: number, year: number): Promise<{ month: string; total: number }[]> {
    const [rows] = await pool.execute(
      `SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(montant) AS total
       FROM expenses e
       JOIN categories c ON e.category_id = c.id
       WHERE e.family_id = ? AND YEAR(e.date) = ? AND c.type = 'expense'
       GROUP BY DATE_FORMAT(date, '%Y-%m')
       ORDER BY month`,
      [familyId, year],
    );
    return rows as { month: string; total: number }[];
  },

  async getCategoryStats(familyId: number, startDate: string, endDate: string): Promise<{ category: string; total: number }[]> {
    const [rows] = await pool.execute(
      `SELECT c.nom AS category, SUM(e.montant) AS total
       FROM expenses e
       JOIN categories c ON e.category_id = c.id
       WHERE e.family_id = ? AND e.date BETWEEN ? AND ? AND c.type = 'expense'
       GROUP BY c.nom
       ORDER BY total DESC`,
      [familyId, startDate, endDate],
    );
    return rows as { category: string; total: number }[];
  },
};
