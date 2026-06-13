import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';

interface AuditLogRow extends RowDataPacket {
  id: number;
  user_id: number;
  entity_id: number | null;
  action: string;
  resource_type: string;
  resource_id: number | null;
  details: string | null;
  ip_address: string | null;
  created_at: string;
  user_nom?: string;
}

const AuditLogModel = {
  async findByEntity(
    entityId: number,
    limit: number = 50,
    offset: number = 0,
  ): Promise<AuditLogRow[]> {
    const [rows] = await pool.execute<AuditLogRow[]>(
      `SELECT al.*, u.nom AS user_nom
       FROM audit_logs al
       JOIN users u ON al.user_id = u.id
       WHERE al.entity_id = ?
       ORDER BY al.created_at DESC
       LIMIT ? OFFSET ?`,
      [entityId, limit, offset],
    );
    return rows;
  },

  async create(data: {
    user_id: number;
    entity_id?: number | null;
    action: string;
    resource_type: string;
    resource_id?: number | null;
    details?: object | null;
    ip_address?: string | null;
  }): Promise<AuditLogRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO audit_logs (user_id, entity_id, action, resource_type, resource_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        data.user_id,
        data.entity_id ?? null,
        data.action,
        data.resource_type,
        data.resource_id ?? null,
        data.details ? JSON.stringify(data.details) : null,
        data.ip_address ?? null,
      ],
    );
    const [rows] = await pool.execute<AuditLogRow[]>(
      `SELECT al.*, u.nom AS user_nom
       FROM audit_logs al
       JOIN users u ON al.user_id = u.id
       WHERE al.id = ?`,
      [result.insertId],
    );
    return rows[0] || null;
  },
};

export default AuditLogModel;
