import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService.js';

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

      const result = await AuthService.register(nom, email, password);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email et mot de passe requis' });
        return;
      }

      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  },

  async me(req: Request, res: Response): Promise<void> {
    res.json({ user: req.user });
  },
};
