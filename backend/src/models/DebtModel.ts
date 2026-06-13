import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';

interface DebtRow extends RowDataPacket {
  id: number;
  entity_id: number;
  type: string;
  contact_name: string;
  amount: number;
  remaining_amount: number;
  description: string | null;
  due_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const DebtModel = {
  async findByEntity(entityId: number): Promise<DebtRow[]> {
    const [rows] = await pool.execute<DebtRow[]>(
      'SELECT * FROM debts WHERE entity_id = ? ORDER BY created_at DESC',
      [entityId],
    );
    return rows;
  },

  async findById(id: number): Promise<DebtRow | null> {
    const [rows] = await pool.execute<DebtRow[]>(
      'SELECT * FROM debts WHERE id = ?',
      [id],
    );
    return rows[0] || null;
  },

  async create(data: {
    entity_id: number;
    type: 'owed_to_us' | 'we_owe';
    contact_name: string;
    amount: number;
    remaining_amount?: number;
    description?: string | null;
    due_date?: string | null;
    status?: string;
  }): Promise<DebtRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO debts (entity_id, type, contact_name, amount, remaining_amount, description, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        data.entity_id,
        data.type,
        data.contact_name,
        data.amount,
        data.remaining_amount ?? data.amount,
        data.description ?? null,
        data.due_date ?? null,
        data.status ?? 'pending',
      ],
    );
    return this.findById(result.insertId);
  },

  async update(
    id: number,
    data: Partial<{
      type: string;
      contact_name: string;
      amount: number;
      remaining_amount: number;
      description: string | null;
      due_date: string | null;
      status: string;
    }>,
  ): Promise<boolean> {
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.type !== undefined) { fields.push('type = ?'); params.push(data.type); }
    if (data.contact_name !== undefined) { fields.push('contact_name = ?'); params.push(data.contact_name); }
    if (data.amount !== undefined) { fields.push('amount = ?'); params.push(data.amount); }
    if (data.remaining_amount !== undefined) { fields.push('remaining_amount = ?'); params.push(data.remaining_amount); }
    if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description); }
    if (data.due_date !== undefined) { fields.push('due_date = ?'); params.push(data.due_date); }
    if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }

    if (fields.length === 0) return false;

    params.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE debts SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM debts WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  },
};

export default DebtModel;
