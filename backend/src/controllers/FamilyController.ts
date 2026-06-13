import type { Request, Response } from 'express';
import { FamilyModel } from '../models/FamilyModel.js';
import { UserModel } from '../models/UserModel.js';

export const FamilyController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { nom_famille } = req.body;
      if (!nom_famille) {
        res.status(400).json({ error: 'Nom de famille requis' });
        return;
      }

      const family = await FamilyModel.create(nom_famille, req.user!.userId);
      res.status(201).json(family);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async list(req: Request, res: Response): Promise<void> {
    const families = await FamilyModel.findByUserId(req.user!.userId);
    res.json(families);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const family = await FamilyModel.findById(Number(req.params.id));
    if (!family) {
      res.status(404).json({ error: 'Famille non trouvée' });
      return;
    }
    res.json(family);
  },

  async members(req: Request, res: Response): Promise<void> {
    const members = await UserModel.getFamilyMembers(Number(req.params.id));
    res.json(members);
  },

  async addMember(req: Request, res: Response): Promise<void> {
    try {
      await FamilyModel.addMember(Number(req.params.id), req.body.user_id);
      res.json({ message: 'Membre ajouté' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async removeMember(req: Request, res: Response): Promise<void> {
    try {
      await FamilyModel.removeMember(Number(req.params.id), Number(req.params.userId));
      res.json({ message: 'Membre retiré' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
