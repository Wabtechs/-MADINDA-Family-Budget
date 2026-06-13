import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';

interface DebtPaymentRow extends RowDataPacket {
  id: number;
  debt_id: number;
  amount: number;
  payment_date: string;
  note: string | null;
  created_at: string;
}

const DebtPaymentModel = {
  async findByDebt(debtId: number): Promise<DebtPaymentRow[]> {
    const [rows] = await pool.execute<DebtPaymentRow[]>(
      'SELECT * FROM debt_payments WHERE debt_id = ? ORDER BY payment_date DESC, created_at DESC',
      [debtId],
    );
    return rows;
  },

  async findById(id: number): Promise<DebtPaymentRow | null> {
    const [rows] = await pool.execute<DebtPaymentRow[]>(
      'SELECT * FROM debt_payments WHERE id = ?',
      [id],
    );
    return rows[0] || null;
  },

  async create(data: {
    debt_id: number;
    amount: number;
    payment_date: string;
    note?: string | null;
  }): Promise<DebtPaymentRow | null> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO debt_payments (debt_id, amount, payment_date, note) VALUES (?, ?, ?, ?)',
      [
        data.debt_id,
        data.amount,
        data.payment_date,
        data.note ?? null,
      ],
    );
    const [rows] = await pool.execute<DebtPaymentRow[]>(
      'SELECT * FROM debt_payments WHERE id = ?',
      [result.insertId],
    );
    return rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM debt_payments WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  },
};

export default DebtPaymentModel;
