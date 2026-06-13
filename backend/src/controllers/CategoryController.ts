import type { Request, Response } from 'express';
import { CategoryModel } from '../models/CategoryModel.js';

export const CategoryController = {
  async list(req: Request, res: Response): Promise<void> {
    const type = req.query.type as 'income' | 'expense' | undefined;
    const categories = await CategoryModel.findAll(type);
    res.json(categories);
  },
};
