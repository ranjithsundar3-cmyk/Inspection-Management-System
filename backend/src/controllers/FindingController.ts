import { Request, Response } from 'express';
import { FindingService } from '../services/FindingService';

export class FindingController {
  private findingService = new FindingService();

  async getAll(req: Request, res: Response) {
    try {
      const result = await this.findingService.getAll({
        inspectionId: req.query.inspectionId ? Number(req.query.inspectionId) : undefined,
        status: req.query.status as any,
        severity: req.query.severity as any,
        assignedToId: req.query.assignedToId ? Number(req.query.assignedToId) : undefined,
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
      const finding = await this.findingService.getById(Number(req.params.id));
      res.json(finding);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const finding = await this.findingService.create({
        ...req.body,
        reportedById: authReq.user?.userId,
      });
      res.status(201).json(finding);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const finding = await this.findingService.update(Number(req.params.id), req.body);
      res.json(finding);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.findingService.delete(Number(req.params.id));
      res.json({ message: 'Finding deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getStatistics(req: Request, res: Response) {
    try {
      const stats = await this.findingService.getStatistics();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}