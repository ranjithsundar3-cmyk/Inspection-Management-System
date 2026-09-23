import { Request, Response } from 'express';
import { InspectionService } from '../services/InspectionService';

export class InspectionController {
  private inspectionService = new InspectionService();

  async getAll(req: Request, res: Response) {
    try {
      const result = await this.inspectionService.getAll({
        status: req.query.status as any,
        type: req.query.type as any,
        assignedInspectorId: req.query.assignedInspectorId ? Number(req.query.assignedInspectorId) : undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const inspection = await this.inspectionService.getById(Number(req.params.id));
      res.json(inspection);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const inspection = await this.inspectionService.create({
        ...req.body,
        createdById: authReq.user?.userId,
      });
      res.status(201).json(inspection);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const inspection = await this.inspectionService.update(Number(req.params.id), req.body);
      res.json(inspection);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.inspectionService.delete(Number(req.params.id));
      res.json({ message: 'Inspection deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getStatistics(req: Request, res: Response) {
    try {
      const stats = await this.inspectionService.getStatistics();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}