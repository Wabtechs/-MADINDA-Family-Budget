import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';

interface BudgetRow extends RowDataPacket {
  id: number;
  entity_id: number;
  category_id: number | null;
  name: string;
  amount: number;
  spent: number;
  period: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  category_name?: string;
}

const BudgetModel = {
  async findByEntity(entityId: number): Promise<BudgetRow[]> {
    const [rows] = await pool.execute<BudgetRow[]>(
      `SELECT b.*, c.name AS category_name
       FROM budgets b
       LEFT JOIN categories c ON b.category_id = c.id
       WHERE b.entity_id = ?
       ORDER BY b.created_at DESC`,
      [entityId],
    );
    return rows;
  },

  async findById(id: number): Promise<BudgetRow | null> {
    const [rows] = await pool.execute<BudgetRow[]>(
      `SELECT b.*, c.name AS category_name
       FROM budgets b
       LEFT JOIN categories c ON b.category_id = c.id
       WHERE b.id = ?`,
      [id],
    );
    return rows[0] || null;
  },

  async create(data: {
    entity_id: number;
    category_id?: number | null;
    name: string;
    amount: number;
    spent?: number;
    period?: string;
    start_date: string;
    end_date?: string | null;
  }): Promise<BudgetRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO budgets (entity_id, category_id, name, amount, spent, period, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        data.entity_id,
        data.category_id ?? null,
        data.name,
        data.amount,
        data.spent ?? 0,
        data.period ?? 'monthly',
        data.start_date,
        data.end_date ?? null,
      ],
    );
    return this.findById(result.insertId);
  },

  async update(
    id: number,
    data: Partial<{
      name: string;
      amount: number;
      spent: number;
      period: string;
      start_date: string;
      end_date: string | null;
      category_id: number | null;
    }>,
  ): Promise<boolean> {
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name); }
    if (data.amount !== undefined) { fields.push('amount = ?'); params.push(data.amount); }
    if (data.spent !== undefined) { fields.push('spent = ?'); params.push(data.spent); }
    if (data.period !== undefined) { fields.push('period = ?'); params.push(data.period); }
    if (data.start_date !== undefined) { fields.push('start_date = ?'); params.push(data.start_date); }
    if (data.end_date !== undefined) { fields.push('end_date = ?'); params.push(data.end_date); }
    if (data.category_id !== undefined) { fields.push('category_id = ?'); params.push(data.category_id); }

    if (fields.length === 0) return false;

    params.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE budgets SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM budgets WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  },

  async updateSpent(id: number, spent: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE budgets SET spent = ? WHERE id = ?',
      [spent, id],
    );
    return result.affectedRows > 0;
  },
};

export default BudgetModel;
