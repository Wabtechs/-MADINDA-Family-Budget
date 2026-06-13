import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';

interface GoalRow extends RowDataPacket {
  id: number;
  entity_id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  status: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const GoalModel = {
  async findByEntity(entityId: number): Promise<GoalRow[]> {
    const [rows] = await pool.execute<GoalRow[]>(
      'SELECT * FROM goals WHERE entity_id = ? ORDER BY created_at DESC',
      [entityId],
    );
    return rows;
  },

  async findById(id: number): Promise<GoalRow | null> {
    const [rows] = await pool.execute<GoalRow[]>(
      'SELECT * FROM goals WHERE id = ?',
      [id],
    );
    return rows[0] || null;
  },

  async create(data: {
    entity_id: number;
    name: string;
    target_amount: number;
    current_amount?: number;
    deadline?: string | null;
    status?: string;
    description?: string | null;
  }): Promise<GoalRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO goals (entity_id, name, target_amount, current_amount, deadline, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        data.entity_id,
        data.name,
        data.target_amount,
        data.current_amount ?? 0,
        data.deadline ?? null,
        data.status ?? 'in_progress',
        data.description ?? null,
      ],
    );
    return this.findById(result.insertId);
  },

  async update(
    id: number,
    data: Partial<{
      name: string;
      target_amount: number;
      current_amount: number;
      deadline: string | null;
      status: string;
      description: string | null;
    }>,
  ): Promise<boolean> {
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name); }
    if (data.target_amount !== undefined) { fields.push('target_amount = ?'); params.push(data.target_amount); }
    if (data.current_amount !== undefined) { fields.push('current_amount = ?'); params.push(data.current_amount); }
    if (data.deadline !== undefined) { fields.push('deadline = ?'); params.push(data.deadline); }
    if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }
    if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description); }

    if (fields.length === 0) return false;

    params.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE goals SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM goals WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  },
};

export default GoalModel;
