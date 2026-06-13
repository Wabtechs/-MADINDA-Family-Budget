import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';

interface TransferRow extends RowDataPacket {
  id: number;
  entity_id: number;
  from_account_id: number;
  to_account_id: number;
  user_id: number;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
  from_account_name?: string;
  to_account_name?: string;
  user_nom?: string;
}

const TransferModel = {
  async findByEntity(
    entityId: number,
    filters?: {
      start_date?: string;
      end_date?: string;
      limit?: number;
      offset?: number;
    },
  ): Promise<TransferRow[]> {
    let sql = `SELECT t.*, 
               fa.name AS from_account_name, 
               ta.name AS to_account_name, 
               u.nom AS user_nom
               FROM transfers t
               JOIN accounts fa ON t.from_account_id = fa.id
               JOIN accounts ta ON t.to_account_id = ta.id
               JOIN users u ON t.user_id = u.id
               WHERE t.entity_id = ?`;
    const params: (string | number)[] = [entityId];

    if (filters?.start_date) { sql += ' AND t.date >= ?'; params.push(filters.start_date); }
    if (filters?.end_date) { sql += ' AND t.date <= ?'; params.push(filters.end_date); }

    sql += ' ORDER BY t.date DESC, t.created_at DESC';

    if (filters?.limit) { sql += ' LIMIT ?'; params.push(filters.limit); }
    if (filters?.offset) { sql += ' OFFSET ?'; params.push(filters.offset); }

    const [rows] = await pool.execute<TransferRow[]>(sql, params);
    return rows;
  },

  async findById(id: number): Promise<TransferRow | null> {
    const [rows] = await pool.execute<TransferRow[]>(
      `SELECT t.*, 
       fa.name AS from_account_name, 
       ta.name AS to_account_name, 
       u.nom AS user_nom
       FROM transfers t
       JOIN accounts fa ON t.from_account_id = fa.id
       JOIN accounts ta ON t.to_account_id = ta.id
       JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [id],
    );
    return rows[0] || null;
  },

  async create(data: {
    entity_id: number;
    from_account_id: number;
    to_account_id: number;
    user_id: number;
    amount: number;
    description?: string | null;
    date: string;
  }): Promise<TransferRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO transfers (entity_id, from_account_id, to_account_id, user_id, amount, description, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        data.entity_id,
        data.from_account_id,
        data.to_account_id,
        data.user_id,
        data.amount,
        data.description ?? null,
        data.date,
      ],
    );
    return this.findById(result.insertId);
  },
};

export default TransferModel;
