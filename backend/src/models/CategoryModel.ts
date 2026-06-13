import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';

interface CategoryRow extends RowDataPacket {
  id: number;
  entity_id: number | null;
  name: string;
  type: string;
  icon: string;
  color: string;
  parent_id: number | null;
  is_active: number;
  created_at: string;
}

const CategoryModel = {
  async findAll(entityId: number, type?: 'income' | 'expense'): Promise<CategoryRow[]> {
    let sql = 'SELECT * FROM categories WHERE (entity_id IS NULL OR entity_id = ?)';
    const params: (number | string)[] = [entityId];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    sql += ' ORDER BY name';
    const [rows] = await pool.execute<CategoryRow[]>(sql, params);
    return rows;
  },

  async findById(id: number): Promise<CategoryRow | null> {
    const [rows] = await pool.execute<CategoryRow[]>(
      'SELECT * FROM categories WHERE id = ?',
      [id],
    );
    return rows[0] || null;
  },

  async create(data: {
    entity_id?: number | null;
    name: string;
    type: 'income' | 'expense';
    icon?: string;
    color?: string;
    parent_id?: number | null;
  }): Promise<CategoryRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO categories (entity_id, name, type, icon, color, parent_id) VALUES (?, ?, ?, ?, ?, ?)',
      [
        data.entity_id ?? null,
        data.name,
        data.type,
        data.icon ?? '📦',
        data.color ?? '#6B7280',
        data.parent_id ?? null,
      ],
    );
    return this.findById(result.insertId);
  },

  async update(
    id: number,
    data: Partial<{
      name: string;
      type: string;
      icon: string;
      color: string;
      parent_id: number | null;
      is_active: number;
    }>,
  ): Promise<boolean> {
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name); }
    if (data.type !== undefined) { fields.push('type = ?'); params.push(data.type); }
    if (data.icon !== undefined) { fields.push('icon = ?'); params.push(data.icon); }
    if (data.color !== undefined) { fields.push('color = ?'); params.push(data.color); }
    if (data.parent_id !== undefined) { fields.push('parent_id = ?'); params.push(data.parent_id); }
    if (data.is_active !== undefined) { fields.push('is_active = ?'); params.push(data.is_active); }

    if (fields.length === 0) return false;

    params.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM categories WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  },
};

export default CategoryModel;
