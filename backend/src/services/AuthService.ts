import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../config/database.js';
import UserModel from '../models/UserModel.js';
import { env } from '../config/env.js';
import type { JwtPayload } from '../types/index.js';
import { ValidationError, AuthError, NotFoundError } from '../utils/errors.js';

const SALT_ROUNDS = 12;

class AuthService {
  async register(data: { nom: string; email: string; password: string }) {
    const existing = await UserModel.findByEmail(data.email);
    if (existing) {
      throw new ValidationError('Un compte avec cet email existe déjà');
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await UserModel.create({
      nom: data.nom,
      email: data.email,
      password: hashedPassword,
    });

    if (!user) {
      throw new Error("Échec de la création de l'utilisateur");
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AuthError('Email ou mot de passe incorrect');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthError('Email ou mot de passe incorrect');
    }

    const token = this.generateToken(user);
    const { password: _, ...userPublic } = user;

    return { user: userPublic, token };
  }

  async getProfile(userId: number) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('Utilisateur non trouvé');
    }
    return user;
  }

  async updateProfile(
    userId: number,
    data: { nom?: string; email?: string; avatar?: string | null; phone?: string | null },
  ) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('Utilisateur non trouvé');
    }

    if (data.email && data.email !== user.email) {
      const existing = await UserModel.findByEmail(data.email);
      if (existing) {
        throw new ValidationError('Cet email est déjà utilisé');
      }
    }

    await UserModel.update(userId, data);
    return UserModel.findById(userId);
  }

  async forgotPassword(email: string) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new NotFoundError('Aucun compte trouvé avec cet email');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000);

    await pool.execute<ResultSetHeader>(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expiresAt],
    );

    return { token, email: user.email };
  }

  async resetPassword(token: string, newPassword: string) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM password_resets WHERE token = ? AND used_at IS NULL AND expires_at > NOW()',
      [token],
    );

    const resetRecord = rows[0];
    if (!resetRecord) {
      throw new ValidationError('Token invalide ou expiré');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await UserModel.updatePassword(resetRecord.user_id, hashedPassword);

    await pool.execute<ResultSetHeader>(
      'UPDATE password_resets SET used_at = NOW() WHERE id = ?',
      [resetRecord.id],
    );

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  private generateToken(user: { id: number; email: string; role: string }): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
  }
}

export default new AuthService();
