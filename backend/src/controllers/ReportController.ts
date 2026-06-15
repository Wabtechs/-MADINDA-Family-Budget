import type { Request, Response, NextFunction } from 'express';
import ReportService from '../services/ReportService.js';

export const ReportController = {
  async monthly(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      const year = Number(req.query.year) || new Date().getFullYear();
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const data = await ReportService.monthlyReport(entityId, req.user!.userId, year);
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  },

  async annual(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      const year = Number(req.query.year) || new Date().getFullYear();
      if (!entityId) {
        res.status(400).json({ error: { message: 'entity_id requis', status: 400 } });
        return;
      }
      const data = await ReportService.annualReport(entityId, req.user!.userId, year);
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  },

  async categories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const entityId = Number(req.query.entity_id);
      const startDate = req.query.start_date as string;
      const endDate = req.query.end_date as string;
      if (!entityId || !startDate || !endDate) {
        res.status(400).json({ error: { message: 'entity_id, start_date et end_date requis', status: 400 } });
        return;
      }
      const data = await ReportService.categoryAnalysis(entityId, req.user!.userId, startDate, endDate);
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  },
};
