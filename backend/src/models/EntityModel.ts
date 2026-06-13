import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';

interface EntityRow extends RowDataPacket {
  id: number;
  name: string;
  type: string;
  description: string | null;
  logo: string | null;
  currency: string;
  timezone: string;
  owner_id: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

const EntityModel = {
  async findAll(ownerId: number): Promise<EntityRow[]> {
    const [rows] = await pool.execute<EntityRow[]>(
      `SELECT e.* FROM entities e
       WHERE e.owner_id = ?
          OR e.id IN (SELECT em.entity_id FROM entity_members em WHERE em.user_id = ?)
       ORDER BY e.name`,
      [ownerId, ownerId],
    );
    return rows;
  },

  async findById(id: number): Promise<EntityRow | null> {
    const [rows] = await pool.execute<EntityRow[]>(
      'SELECT * FROM entities WHERE id = ?',
      [id],
    );
    return rows[0] || null;
  },

  async create(data: {
    name: string;
    type?: string;
    description?: string | null;
    logo?: string | null;
    currency?: string;
    timezone?: string;
    owner_id: number;
  }): Promise<EntityRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO entities (name, type, description, logo, currency, timezone, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        data.name,
        data.type ?? 'family',
        data.description ?? null,
        data.logo ?? null,
        data.currency ?? 'EUR',
        data.timezone ?? 'UTC',
        data.owner_id,
      ],
    );
    return this.findById(result.insertId);
  },

  async update(
    id: number,
    data: Partial<{
      name: string;
      type: string;
      description: string | null;
      logo: string | null;
      currency: string;
      timezone: string;
      is_active: number;
    }>,
  ): Promise<boolean> {
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name); }
    if (data.type !== undefined) { fields.push('type = ?'); params.push(data.type); }
    if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description); }
    if (data.logo !== undefined) { fields.push('logo = ?'); params.push(data.logo); }
    if (data.currency !== undefined) { fields.push('currency = ?'); params.push(data.currency); }
    if (data.timezone !== undefined) { fields.push('timezone = ?'); params.push(data.timezone); }
    if (data.is_active !== undefined) { fields.push('is_active = ?'); params.push(data.is_active); }

    if (fields.length === 0) return false;

    params.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE entities SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM entities WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  },
};

export default EntityModel;
