import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';

interface EntityMemberRow extends RowDataPacket {
  id: number;
  entity_id: number;
  user_id: number;
  role: string;
  status: string;
  invited_at: string;
  joined_at: string | null;
  created_at: string;
}

interface MemberWithUserRow extends RowDataPacket {
  id: number;
  entity_id: number;
  user_id: number;
  role: string;
  status: string;
  invited_at: string;
  joined_at: string | null;
  user_nom: string;
  user_email: string;
}

interface EntityWithRoleRow extends RowDataPacket {
  id: number;
  entity_id: number;
  user_id: number;
  role: string;
  status: string;
  entity_name: string;
  entity_type: string;
}

const EntityMemberModel = {
  async findByEntity(entityId: number): Promise<MemberWithUserRow[]> {
    const [rows] = await pool.execute<MemberWithUserRow[]>(
      `SELECT em.*, u.nom AS user_nom, u.email AS user_email
       FROM entity_members em
       JOIN users u ON em.user_id = u.id
       WHERE em.entity_id = ?
       ORDER BY em.created_at DESC`,
      [entityId],
    );
    return rows;
  },

  async findByUser(userId: number): Promise<EntityWithRoleRow[]> {
    const [rows] = await pool.execute<EntityWithRoleRow[]>(
      `SELECT em.*, e.name AS entity_name, e.type AS entity_type
       FROM entity_members em
       JOIN entities e ON em.entity_id = e.id
       WHERE em.user_id = ?
       ORDER BY e.name`,
      [userId],
    );
    return rows;
  },

  async findByEntityAndUser(entityId: number, userId: number): Promise<EntityMemberRow | null> {
    const [rows] = await pool.execute<EntityMemberRow[]>(
      'SELECT * FROM entity_members WHERE entity_id = ? AND user_id = ?',
      [entityId, userId],
    );
    return rows[0] || null;
  },

  async create(data: {
    entity_id: number;
    user_id: number;
    role?: string;
    status?: string;
  }): Promise<EntityMemberRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO entity_members (entity_id, user_id, role, status) VALUES (?, ?, ?, ?)',
      [
        data.entity_id,
        data.user_id,
        data.role ?? 'viewer',
        data.status ?? 'pending',
      ],
    );
    const [rows] = await pool.execute<EntityMemberRow[]>(
      'SELECT * FROM entity_members WHERE id = ?',
      [result.insertId],
    );
    return rows[0] || null;
  },

  async update(
    id: number,
    data: Partial<{ role: string; status: string }>,
  ): Promise<boolean> {
    const fields: string[] = [];
    const params: (string | number)[] = [];

    if (data.role !== undefined) { fields.push('role = ?'); params.push(data.role); }
    if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }

    if (fields.length === 0) return false;

    params.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE entity_members SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM entity_members WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  },

  async isMember(entityId: number, userId: number): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM entity_members WHERE entity_id = ? AND user_id = ?',
      [entityId, userId],
    );
    return (rows as RowDataPacket[]).length > 0;
  },
};

export default EntityMemberModel;
