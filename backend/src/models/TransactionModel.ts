import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';

interface TransactionRow extends RowDataPacket {
  id: number;
  entity_id: number;
  account_id: number;
  user_id: number;
  type: string;
  reference_type: string;
  reference_id: number;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
  account_name?: string;
  user_nom?: string;
}

const TransactionModel = {
  async findByEntity(
    entityId: number,
    filters?: {
      account_id?: number;
      type?: string;
      start_date?: string;
      end_date?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<TransactionRow[]> {
    let sql = `SELECT t.*, a.name AS account_name, u.nom AS user_nom
               FROM transactions t
               JOIN accounts a ON t.account_id = a.id
               JOIN users u ON t.user_id = u.id
               WHERE t.entity_id = ?`;
    const params: (string | number)[] = [entityId];

    if (filters?.account_id) { sql += ' AND t.account_id = ?'; params.push(filters.account_id); }
    if (filters?.type) { sql += ' AND t.type = ?'; params.push(filters.type); }
    if (filters?.start_date) { sql += ' AND t.date >= ?'; params.push(filters.start_date); }
    if (filters?.end_date) { sql += ' AND t.date <= ?'; params.push(filters.end_date); }

    sql += ' ORDER BY t.date DESC, t.created_at DESC';

    if (filters?.limit) { sql += ' LIMIT ?'; params.push(filters.limit); }
    if (filters?.offset) { sql += ' OFFSET ?'; params.push(filters.offset); }

    const [rows] = await pool.execute<TransactionRow[]>(sql, params);
    return rows;
  },

  async findById(id: number): Promise<TransactionRow | null> {
    const [rows] = await pool.execute<TransactionRow[]>(
      `SELECT t.*, a.name AS account_name, u.nom AS user_nom
       FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [id],
    );
    return rows[0] || null;
  },

  async create(data: {
    entity_id: number;
    account_id: number;
    user_id: number;
    type: string;
    reference_type: string;
    reference_id: number;
    amount: number;
    description?: string | null;
    date: string;
  }): Promise<TransactionRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO transactions (entity_id, account_id, user_id, type, reference_type, reference_id, amount, description, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        data.entity_id,
        data.account_id,
        data.user_id,
        data.type,
        data.reference_type,
        data.reference_id,
        data.amount,
        data.description ?? null,
        data.date,
      ],
    );
    return this.findById(result.insertId);
  },

  async findByReference(referenceType: string, referenceId: number): Promise<TransactionRow[]> {
    const [rows] = await pool.execute<TransactionRow[]>(
      'SELECT * FROM transactions WHERE reference_type = ? AND reference_id = ?',
      [referenceType, referenceId],
    );
    return rows;
  },

  async update(
    id: number,
    data: Partial<{
      account_id: number;
      amount: number;
      description: string | null;
      date: string;
    }>,
  ): Promise<boolean> {
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.account_id !== undefined) { fields.push('account_id = ?'); params.push(data.account_id); }
    if (data.amount !== undefined) { fields.push('amount = ?'); params.push(data.amount); }
    if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description); }
    if (data.date !== undefined) { fields.push('date = ?'); params.push(data.date); }

    if (fields.length === 0) return false;

    params.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return result.affectedRows > 0;
  },

  async getRecent(entityId: number, limit: number = 10): Promise<TransactionRow[]> {
    const [rows] = await pool.execute<TransactionRow[]>(
      `SELECT t.*, a.name AS account_name, u.nom AS user_nom
       FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       JOIN users u ON t.user_id = u.id
       WHERE t.entity_id = ?
       ORDER BY t.date DESC, t.created_at DESC
       LIMIT ?`,
      [entityId, limit],
    );
    return rows;
  },
};

export default TransactionModel;
