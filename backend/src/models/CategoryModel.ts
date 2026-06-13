import pool from '../config/database.js';
import type { Category } from '../types/index.js';

export const CategoryModel = {
  async findAll(type?: 'income' | 'expense'): Promise<Category[]> {
    let sql = 'SELECT * FROM categories';
    const params: string[] = [];
    if (type) { sql += ' WHERE type = ?'; params.push(type); }
    sql += ' ORDER BY nom';
    const [rows] = await pool.execute(sql, params);
    return rows as Category[];
  },

  async findById(id: number): Promise<Category | null> {
    const [rows] = await pool.execute('SELECT * FROM categories WHERE id = ?', [id]);
    const categories = rows as Category[];
    return categories[0] || null;
  },
};
