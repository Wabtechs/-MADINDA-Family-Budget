import type { Request, Response, NextFunction } from 'express';
import DocumentService from '../services/DocumentService.js';

export const DocumentController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const documents = await DocumentService.list(entityId, req.user!.userId);
      res.status(200).json({ data: documents });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { entity_id, name, type, file_url, file_size, mime_type, description } = req.body;
      if (!entity_id || !name || !file_url) {
        res.status(400).json({ error: { message: 'entity_id, name et file_url requis', status: 400 } });
        return;
      }
      const document = await DocumentService.create(entity_id, req.user!.userId, {
        name,
        type: type || 'other',
        file_url,
        file_size: file_size || null,
        mime_type: mime_type || null,
        description: description || null,
      });
      res.status(201).json({ data: document, message: 'Document créé avec succès' });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await DocumentService.delete(Number(req.params.id), req.user!.userId);
      res.status(200).json({ message: 'Document supprimé' });
    } catch (err) {
      next(err);
    }
  },
};
