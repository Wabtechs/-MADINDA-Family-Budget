import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';

interface AccountRow extends RowDataPacket {
  id: number;
  entity_id: number;
  name: string;
  type: string;
  balance: number;
  currency: string;
  account_number: string | null;
  bank_name: string | null;
  description: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

const AccountModel = {
  async findByEntity(entityId: number): Promise<AccountRow[]> {
    const [rows] = await pool.execute<AccountRow[]>(
      'SELECT * FROM accounts WHERE entity_id = ? ORDER BY name',
      [entityId],
    );
    return rows;
  },

  async findById(id: number): Promise<AccountRow | null> {
    const [rows] = await pool.execute<AccountRow[]>(
      'SELECT * FROM accounts WHERE id = ?',
      [id],
    );
    return rows[0] || null;
  },

  async create(data: {
    entity_id: number;
    name: string;
    type?: string;
    balance?: number;
    currency?: string;
    account_number?: string | null;
    bank_name?: string | null;
    description?: string | null;
  }): Promise<AccountRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO accounts (entity_id, name, type, balance, currency, account_number, bank_name, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        data.entity_id,
        data.name,
        data.type ?? 'bank',
        data.balance ?? 0,
        data.currency ?? 'EUR',
        data.account_number ?? null,
        data.bank_name ?? null,
        data.description ?? null,
      ],
    );
    return this.findById(result.insertId);
  },

  async update(
    id: number,
    data: Partial<{
      name: string;
      type: string;
      balance: number;
      currency: string;
      account_number: string | null;
      bank_name: string | null;
      description: string | null;
      is_active: number;
    }>,
  ): Promise<boolean> {
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.name !== undefined) { fields.push('name = ?'); params.push(data.name); }
    if (data.type !== undefined) { fields.push('type = ?'); params.push(data.type); }
    if (data.balance !== undefined) { fields.push('balance = ?'); params.push(data.balance); }
    if (data.currency !== undefined) { fields.push('currency = ?'); params.push(data.currency); }
    if (data.account_number !== undefined) { fields.push('account_number = ?'); params.push(data.account_number); }
    if (data.bank_name !== undefined) { fields.push('bank_name = ?'); params.push(data.bank_name); }
    if (data.description !== undefined) { fields.push('description = ?'); params.push(data.description); }
    if (data.is_active !== undefined) { fields.push('is_active = ?'); params.push(data.is_active); }

    if (fields.length === 0) return false;

    params.push(id);
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE accounts SET ${fields.join(', ')} WHERE id = ?`,
      params,
    );
    return result.affectedRows > 0;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM accounts WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  },

  async updateBalance(id: number, newBalance: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE accounts SET balance = ? WHERE id = ?',
      [newBalance, id],
    );
    return result.affectedRows > 0;
  },
};

export default AccountModel;
