import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';

interface IncomeRow extends RowDataPacket {
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
  created_at: string;
  updated_at: string;
}

interface IncomeStatsRow extends RowDataPacket {
  total: number;
  count: number;
}

interface IncomeByCategoryRow extends RowDataPacket {
  category_name: string;
  total: number;
  count: number;
}

const IncomeModel = {
  async findByEntity(
    entityId: number,
    filters?: {
      account_id?: number;
      category_id?: number;
      start_date?: string;
      end_date?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<IncomeRow[]> {
    let sql = 'SELECT i.*, c.name AS category_name, a.name AS account_name, u.nom AS user_nom FROM incomes i JOIN categories c ON i.category_id = c.id JOIN accounts a ON i.account_id = a.id JOIN users u ON i.user_id = u.id WHERE i.entity_id = ?';
    const params: (string | number)[] = [entityId];

    if (filters?.account_id) { sql += ' AND i.account_id = ?'; params.push(filters.account_id); }
    if (filters?.category_id) { sql += ' AND i.category_id = ?'; params.push(filters.category_id); }
    if (filters?.start_date) { sql += ' AND i.date >= ?'; params.push(filters.start_date); }
    if (filters?.end_date) { sql += ' AND i.date <= ?'; params.push(filters.end_date); }

    sql += ' ORDER BY i.date DESC, i.created_at DESC';

    if (filters?.limit) { sql += ' LIMIT ?'; params.push(filters.limit); }
    if (filters?.offset) { sql += ' OFFSET ?'; params.push(filters.offset); }

    const [rows] = await pool.execute<IncomeRow[]>(sql, params);
    return rows;
  },

  async findById(id: number): Promise<IncomeRow | null> {
    const [rows] = await pool.execute<IncomeRow[]>(
      `SELECT i.*, c.name AS category_name, a.name AS account_name, u.nom AS user_nom
       FROM incomes i
       JOIN categories c ON i.category_id = c.id
       JOIN accounts a ON i.account_id = a.id
       JOIN users u ON i.user_id = u.id
       WHERE i.id = ?`,
      [id],
    );
    return rows[0] || null;
  },

  async create(data: {
    entity_id: number;
    account_id: number;
    category_id: number;
    user_id: number;
    amount: number;
    source?: string | null;
    description?: string | null;
    date: string;
    is_recurring?: number;
    recurring_interval?: string | null;
    recurring_end_date?: string | null;
    attachment_url?: string | null;
  }): Promise<IncomeRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO incomes (entity_id, account_id, category_id, user_id, amount, source, description, date, is_recurring, recurring_interval, recurring_end_date, attachment_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.entity_id,
        data.account_id,
        data.category_id,
        data.user_id,
        data.amount,
        data.source ?? null,
        data.description ?? null,
        data.date,
        data.is_recurring ?? 0,
        data.recurring_interval ?? null,
        data.recurring_end_date ?? null,
        data.attachment_url ?? null,
      ],
    );
    return this.findById(result.insertId);
  },

  async update(
    id: number,
    data: Partial<{
      account_id: number;
      category_id: number;
      amount: number;
      source: string | null;
      description: string | null;
      date: string;
      is_recurring: number;
      recurring_interval: string | null;
      recurring_end_date: string | null;
      attachment_url: string | null;
    }>,
  ): Promise<boolean> {
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.account_id !== undefined) { fields.push('account_id = ?'); params.push(data.account_id); }
    if (data.category_id !== undefined) { fields.push('category_id = ?'); params.push(data.category_id); }
    if (data.amount !== undefined) { fields.push('amount = ?'); params.push(data.amount); }
    if (data.source !== undefined) { fields.push('source = ?'); params.push(data.source); }
    if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description); }
    if (data.date !== undefined) { fields.push('date = ?'); params.push(data.date); }
    if (data.is_recurring !== undefined) { fields.push('is_recurring = ?'); params.push(data.is_recurring); }
    if (data.recurring_interval !== undefined) { fields.push('recurring_interval = ?'); params.push(data.recurring_interval); }
    if (data.recurring_end_date !== undefined) { fields.push('recurring_end_date = ?'); params.push(data.recurring_end_date); }
    if (data.attachment_url !== undefined) { fields.push('attachment_url = ?'); params.push(data.attachment_url); }

    if (fields.length === 0) return false;

    params.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE incomes SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM incomes WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  },

  async getStats(
    entityId: number,
    startDate: string,
    endDate: string,
  ): Promise<{
    total: number;
    count: number;
    byCategory: { category_name: string; total: number; count: number }[];
  }> {
    const [totalRows] = await pool.execute<IncomeStatsRow[]>(
      `SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count
       FROM incomes
       WHERE entity_id = ? AND date BETWEEN ? AND ?`,
      [entityId, startDate, endDate],
    );

    const [byCategory] = await pool.execute<IncomeByCategoryRow[]>(
      `SELECT c.name AS category_name, COALESCE(SUM(i.amount), 0) AS total, COUNT(*) AS count
       FROM incomes i
       JOIN categories c ON i.category_id = c.id
       WHERE i.entity_id = ? AND i.date BETWEEN ? AND ?
       GROUP BY c.name
       ORDER BY total DESC`,
      [entityId, startDate, endDate],
    );

    return {
      total: totalRows[0].total,
      count: totalRows[0].count,
      byCategory,
    };
  },
};

export default IncomeModel;
