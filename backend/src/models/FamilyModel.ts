import type { ResultSetHeader } from 'mysql2';
import pool from '../config/database.js';
import type { Family } from '../types/index.js';

export const FamilyModel = {
  async create(nomFamille: string, userId: number): Promise<Family> {
    const [result] = await pool.execute(
      'INSERT INTO families (nom_famille) VALUES (?)',
      [nomFamille],
    );
    const insertId = (result as ResultSetHeader).insertId;

    await pool.execute(
      'INSERT INTO family_members (user_id, family_id) VALUES (?, ?)',
      [userId, insertId],
    );

    return this.findById(insertId) as Promise<Family>;
  },

  async findById(id: number): Promise<Family | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM families WHERE id = ?',
      [id],
    );
    const families = rows as Family[];
    return families[0] || null;
  },

  async findByUserId(userId: number): Promise<Family[]> {
    const [rows] = await pool.execute(
      `SELECT f.* FROM families f
       JOIN family_members fm ON f.id = fm.family_id
       WHERE fm.user_id = ?`,
      [userId],
    );
    return rows as Family[];
  },

  async addMember(familyId: number, userId: number): Promise<void> {
    await pool.execute(
      'INSERT IGNORE INTO family_members (user_id, family_id) VALUES (?, ?)',
      [userId, familyId],
    );
  },

  async removeMember(familyId: number, userId: number): Promise<void> {
    await pool.execute(
      'DELETE FROM family_members WHERE family_id = ? AND user_id = ?',
      [familyId, userId],
    );
  },
};
