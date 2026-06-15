import type { Request, Response, NextFunction } from 'express';
import EntityService from '../services/EntityService.js';

export const EntityController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await EntityService.list(req.user!.userId);
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, type, description, currency, timezone } = req.body;
      if (!name) {
        res.status(400).json({ error: { message: 'Le nom est requis', status: 400 } });
        return;
      }
      const entity = await EntityService.create(req.user!.userId, {
        name,
        type: type || 'family',
        description: description || null,
        currency: currency || 'EUR',
        timezone: timezone || 'UTC',
      });
      res.status(201).json({ data: entity, message: 'Entité créée avec succès' });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entity = await EntityService.getById(Number(req.params.id), req.user!.userId);
      res.status(200).json({ data: entity });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, type, description, logo, currency, timezone } = req.body;
      const updateData: Record<string, string | number | null> = {};
      if (name !== undefined) updateData.name = name;
      if (type !== undefined) updateData.type = type;
      if (description !== undefined) updateData.description = description;
      if (logo !== undefined) updateData.logo = logo;
      if (currency !== undefined) updateData.currency = currency;
      if (timezone !== undefined) updateData.timezone = timezone;
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: { message: 'Aucune donnée à mettre à jour', status: 400 } });
        return;
      }
      await EntityService.update(Number(req.params.id), req.user!.userId, updateData);
      res.status(200).json({ message: 'Entité mise à jour' });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await EntityService.delete(Number(req.params.id), req.user!.userId);
      res.status(200).json({ message: 'Entité supprimée' });
    } catch (err) {
      next(err);
    }
  },

  async getMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const members = await EntityService.getMembers(Number(req.params.id), req.user!.userId);
      res.status(200).json({ data: members });
    } catch (err) {
      next(err);
    }
  },

  async addMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user_id, email, role } = req.body;
      if (!user_id && !email) {
        res.status(400).json({ error: { message: 'user_id ou email requis', status: 400 } });
        return;
      }
      const member = await EntityService.addMember(Number(req.params.id), req.user!.userId, { user_id, email, role });
      res.status(201).json({ data: member, message: 'Membre ajouté' });
    } catch (err) {
      next(err);
    }
  },

  async updateMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role, status } = req.body;
      await EntityService.updateMember(Number(req.params.id), req.user!.userId, Number(req.params.userId), { role, status });
      res.status(200).json({ message: 'Membre mis à jour' });
    } catch (err) {
      next(err);
    }
  },

  async removeMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await EntityService.removeMember(Number(req.params.id), req.user!.userId, Number(req.params.userId));
      res.status(200).json({ message: 'Membre retiré' });
    } catch (err) {
      next(err);
    }
  },
};
