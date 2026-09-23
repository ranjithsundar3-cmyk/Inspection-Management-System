import { Request, Response } from 'express';
import { ReportService } from '../services/ReportService';

export class ReportController {
  private reportService = new ReportService();

  async generate(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const { inspectionId, format } = req.body;
      const report = await this.reportService.generateReport(
        inspectionId,
        authReq.user?.userId,
        format
      );
      res.status(201).json(report);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const result = await this.reportService.getAll({
        inspectionId: req.query.inspectionId ? Number(req.query.inspectionId) : undefined,
        format: req.query.format as any,
        status: req.query.status as any,
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
      const report = await this.reportService.getById(Number(req.params.id));
      res.json(report);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const report = await this.reportService.updateStatus(Number(req.params.id), req.body.status);
      res.json(report);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.reportService.delete(Number(req.params.id));
      res.json({ message: 'Report deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}