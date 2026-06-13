import type { ResultSetHeader } from 'mysql2';
import pool from '../config/database.js';
import type { Budget } from '../types/index.js';

export const BudgetModel = {
  async create(data: Omit<Budget, 'id' | 'created_at'>): Promise<Budget> {
    const [result] = await pool.execute(
      'INSERT INTO budgets (family_id, category_id, montant, periode, date_debut, date_fin) VALUES (?, ?, ?, ?, ?, ?)',
      [data.family_id, data.category_id, data.montant, data.periode, data.date_debut, data.date_fin],
    );
    const insertId = (result as ResultSetHeader).insertId;
    return this.findById(insertId) as Promise<Budget>;
  },

  async findById(id: number): Promise<Budget | null> {
    const [rows] = await pool.execute('SELECT * FROM budgets WHERE id = ?', [id]);
    const budgets = rows as Budget[];
    return budgets[0] || null;
  },

  async findByFamily(familyId: number): Promise<Budget[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM budgets WHERE family_id = ? ORDER BY created_at DESC',
      [familyId],
    );
    return rows as Budget[];
  },

  async update(id: number, data: Partial<Omit<Budget, 'id' | 'created_at'>>): Promise<boolean> {
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.montant !== undefined) { fields.push('montant = ?'); params.push(data.montant); }
    if (data.periode !== undefined) { fields.push('periode = ?'); params.push(data.periode); }
    if (data.category_id !== undefined) { fields.push('category_id = ?'); params.push(data.category_id); }

    if (fields.length === 0) return false;
    params.push(id);
    const [result] = await pool.execute(
      `UPDATE budgets SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return (result as ResultSetHeader).affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute('DELETE FROM budgets WHERE id = ?', [id]);
    return (result as ResultSetHeader).affectedRows > 0;
  },
};
