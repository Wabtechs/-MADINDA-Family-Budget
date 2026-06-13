import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel.js';
import { env } from '../config/env.js';
import type { UserPublic, JwtPayload } from '../types/index.js';

const SALT_ROUNDS = 12;

export const AuthService = {
  async register(nom: string, email: string, password: string): Promise<{ user: UserPublic; token: string }> {
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw new Error('Un compte avec cet email existe déjà');
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserModel.create(nom, email, hashed);
    const token = generateToken(user);

    return { user, token };
  },

  async login(email: string, password: string): Promise<{ user: UserPublic; token: string }> {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = generateToken(user);
    const { password: _, ...userPublic } = user;

    return { user: userPublic, token };
  },
};

function generateToken(user: { id: number; email: string; role: string }): string {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
}
