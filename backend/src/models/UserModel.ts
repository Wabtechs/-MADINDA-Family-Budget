import type { ResultSetHeader } from 'mysql2';
import pool from '../config/database.js';
import type { User, UserPublic } from '../types/index.js';

export const UserModel = {
  async create(nom: string, email: string, password: string): Promise<UserPublic> {
    const [result] = await pool.execute(
      'INSERT INTO users (nom, email, password) VALUES (?, ?, ?)',
      [nom, email, password],
    );
    const insertId = (result as ResultSetHeader).insertId;
    return this.findById(insertId) as Promise<UserPublic>;
  },

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email],
    );
    const users = rows as User[];
    return users[0] || null;
  },

  async findById(id: number): Promise<UserPublic | null> {
    const [rows] = await pool.execute(
      'SELECT id, nom, email, role, created_at FROM users WHERE id = ?',
      [id],
    );
    const users = rows as UserPublic[];
    return users[0] || null;
  },

  async getFamilyMembers(familyId: number): Promise<UserPublic[]> {
    const [rows] = await pool.execute(
      `SELECT u.id, u.nom, u.email, u.role, u.created_at
       FROM users u
       JOIN family_members fm ON u.id = fm.user_id
       WHERE fm.family_id = ?`,
      [familyId],
    );
    return rows as UserPublic[];
  },
};
