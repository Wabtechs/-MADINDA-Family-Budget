import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';

interface UserRow extends RowDataPacket {
  id: number;
  nom: string;
  email: string;
  password: string;
  role: string;
  avatar: string | null;
  phone: string | null;
  email_verified_at: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface UserPublicRow extends RowDataPacket {
  id: number;
  nom: string;
  email: string;
  role: string;
  avatar: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

const UserModel = {
  async findAll(): Promise<UserPublicRow[]> {
    const [rows] = await pool.execute<UserPublicRow[]>(
      'SELECT id, nom, email, role, avatar, phone, created_at, updated_at FROM users WHERE is_active = 1 ORDER BY nom',
    );
    return rows;
  },

  async findById(id: number): Promise<UserPublicRow | null> {
    const [rows] = await pool.execute<UserPublicRow[]>(
      'SELECT id, nom, email, role, avatar, phone, created_at, updated_at FROM users WHERE id = ?',
      [id],
    );
    return rows[0] || null;
  },

  async findByEmail(email: string): Promise<UserRow | null> {
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE email = ?',
      [email],
    );
    return rows[0] || null;
  },

  async create(data: {
    nom: string;
    email: string;
    password: string;
    role?: string;
    avatar?: string | null;
    phone?: string | null;
  }): Promise<UserPublicRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (nom, email, password, role, avatar, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [
        data.nom,
        data.email,
        data.password,
        data.role ?? 'manager',
        data.avatar ?? null,
        data.phone ?? null,
      ],
    );
    return this.findById(result.insertId);
  },

  async update(
    id: number,
    data: Partial<{
      nom: string;
      email: string;
      role: string;
      avatar: string | null;
      phone: string | null;
    }>,
  ): Promise<boolean> {
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.nom !== undefined) { fields.push('nom = ?'); params.push(data.nom); }
    if (data.email !== undefined) { fields.push('email = ?'); params.push(data.email); }
    if (data.role !== undefined) { fields.push('role = ?'); params.push(data.role); }
    if (data.avatar !== undefined) { fields.push('avatar = ?'); params.push(data.avatar); }
    if (data.phone !== undefined) { fields.push('phone = ?'); params.push(data.phone); }

    if (fields.length === 0) return false;

    params.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET is_active = 0 WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  },

  async updatePassword(id: number, password: string): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET password = ? WHERE id = ?',
      [password, id],
    );
    return result.affectedRows > 0;
  },
};

export default UserModel;
