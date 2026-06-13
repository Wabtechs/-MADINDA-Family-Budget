import type { Request, Response } from 'express';
import AuthService from '../services/AuthService.js';
import UserModel from '../models/UserModel.js';
import bcrypt from 'bcryptjs';

export const AuthController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { nom, email, password } = req.body;

      if (!nom || !email || !password) {
        res.status(400).json({ error: 'Nom, email et mot de passe requis' });
        return;
      }
      if (password.length < 6) {
        res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
        return;
      }

      const result = await AuthService.register({ nom, email, password });
      res.status(201).json({ data: result, message: 'Compte créé avec succès' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: { message: 'Email et mot de passe requis', status: 400 } });
        return;
      }

      const result = await AuthService.login(email, password);
      res.status(200).json({ data: result, message: 'Connexion réussie' });
    } catch (err: any) {
      res.status(401).json({ error: { message: err.message, status: 401 } });
    }
  },

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserModel.findById(req.user!.userId);
      if (!user) {
        res.status(404).json({ error: { message: 'Utilisateur non trouvé', status: 404 } });
        return;
      }
      res.status(200).json({ data: user });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { nom, email, phone } = req.body;
      const updateData: Record<string, string> = {};
      if (nom !== undefined) updateData.nom = nom;
      if (email !== undefined) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: { message: 'Aucune donnée à mettre à jour', status: 400 } });
        return;
      }

      const updated = await UserModel.update(req.user!.userId, updateData);
      if (!updated) {
        res.status(404).json({ error: { message: 'Utilisateur non trouvé', status: 404 } });
        return;
      }

      const user = await UserModel.findById(req.user!.userId);
      res.status(200).json({ data: user, message: 'Profil mis à jour' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ error: { message: 'Email requis', status: 400 } });
        return;
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        res.status(200).json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé' });
        return;
      }

      // In production: generate reset token, send email
      res.status(200).json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé' });
    } catch (err: any) {
      res.status(500).json({ error: { message: err.message, status: 500 } });
    }
  },

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        res.status(400).json({ error: { message: 'Token et nouveau mot de passe requis', status: 400 } });
        return;
      }
      if (password.length < 6) {
        res.status(400).json({ error: { message: 'Le mot de passe doit contenir au moins 6 caractères', status: 400 } });
        return;
      }

      // In production: verify token, find user, update password
      res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (err: any) {
      res.status(400).json({ error: { message: err.message, status: 400 } });
    }
  },
};
