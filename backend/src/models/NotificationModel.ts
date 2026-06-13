import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';

interface NotificationRow extends RowDataPacket {
  id: number;
  user_id: number;
  entity_id: number | null;
  type: string;
  title: string;
  message: string;
  is_read: number;
  read_at: string | null;
  created_at: string;
}

interface UnreadCountRow extends RowDataPacket {
  count: number;
}

const NotificationModel = {
  async findByUser(userId: number, unreadOnly: boolean = false): Promise<NotificationRow[]> {
    let sql = 'SELECT * FROM notifications WHERE user_id = ?';
    const params: (number)[] = [userId];

    if (unreadOnly) {
      sql += ' AND is_read = 0';
    }

    sql += ' ORDER BY created_at DESC';
    const [rows] = await pool.execute<NotificationRow[]>(sql, params);
    return rows;
  },

  async findById(id: number): Promise<NotificationRow | null> {
    const [rows] = await pool.execute<NotificationRow[]>(
      'SELECT * FROM notifications WHERE id = ?',
      [id],
    );
    return rows[0] || null;
  },

  async create(data: {
    user_id: number;
    entity_id?: number | null;
    type: string;
    title: string;
    message: string;
  }): Promise<NotificationRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO notifications (user_id, entity_id, type, title, message) VALUES (?, ?, ?, ?, ?)',
      [
        data.user_id,
        data.entity_id ?? null,
        data.type,
        data.title,
        data.message,
      ],
    );
    const [rows] = await pool.execute<NotificationRow[]>(
      'SELECT * FROM notifications WHERE id = ?',
      [result.insertId],
    );
    return rows[0] || null;
  },

  async markAsRead(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  },

  async markAllAsRead(userId: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE user_id = ? AND is_read = 0',
      [userId],
    );
    return result.affectedRows > 0;
  },

  async getUnreadCount(userId: number): Promise<number> {
    const [rows] = await pool.execute<UnreadCountRow[]>(
      'SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0',
      [userId],
    );
    return rows[0].count;
  },
};

export default NotificationModel;
