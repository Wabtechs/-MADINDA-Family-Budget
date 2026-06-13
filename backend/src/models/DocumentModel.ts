import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';

interface DocumentRow extends RowDataPacket {
  id: number;
  entity_id: number;
  user_id: number;
  name: string;
  type: string;
  file_url: string;
  file_size: number | null;
  mime_type: string | null;
  description: string | null;
  created_at: string;
  user_nom?: string;
}

const DocumentModel = {
  async findByEntity(entityId: number): Promise<DocumentRow[]> {
    const [rows] = await pool.execute<DocumentRow[]>(
      `SELECT d.*, u.nom AS user_nom
       FROM documents d
       JOIN users u ON d.user_id = u.id
       WHERE d.entity_id = ?
       ORDER BY d.created_at DESC`,
      [entityId],
    );
    return rows;
  },

  async findById(id: number): Promise<DocumentRow | null> {
    const [rows] = await pool.execute<DocumentRow[]>(
      `SELECT d.*, u.nom AS user_nom
       FROM documents d
       JOIN users u ON d.user_id = u.id
       WHERE d.id = ?`,
      [id],
    );
    return rows[0] || null;
  },

  async create(data: {
    entity_id: number;
    user_id: number;
    name: string;
    type?: string;
    file_url: string;
    file_size?: number | null;
    mime_type?: string | null;
    description?: string | null;
  }): Promise<DocumentRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO documents (entity_id, user_id, name, type, file_url, file_size, mime_type, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        data.entity_id,
        data.user_id,
        data.name,
        data.type ?? 'other',
        data.file_url,
        data.file_size ?? null,
        data.mime_type ?? null,
        data.description ?? null,
      ],
    );
    return this.findById(result.insertId);
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM documents WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  },
};

export default DocumentModel;
