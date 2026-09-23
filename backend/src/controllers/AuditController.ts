import { Request, Response } from 'express';
import { AuditService } from '../services/AuditService';

export class AuditController {
  private auditService = new AuditService();

  async getAll(req: Request, res: Response) {
    try {
      const result = await this.auditService.getAll({
        status: req.query.status as any,
        type: req.query.type as any,
        leadAuditorId: req.query.leadAuditorId ? Number(req.query.leadAuditorId) : undefined,
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
      const audit = await this.auditService.getById(Number(req.params.id));
      res.json(audit);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const audit = await this.auditService.create({
        ...req.body,
        createdById: authReq.user?.userId,
      });
      res.status(201).json(audit);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const audit = await this.auditService.update(Number(req.params.id), req.body);
      res.json(audit);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.auditService.delete(Number(req.params.id));
      res.json({ message: 'Audit deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async addAuditors(req: Request, res: Response) {
    try {
      const audit = await this.auditService.addAuditors(Number(req.params.id), req.body.auditorIds);
      res.json(audit);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeAuditor(req: Request, res: Response) {
    try {
      const audit = await this.auditService.removeAuditor(Number(req.params.id), Number(req.params.auditorId));
      res.json(audit);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getStatistics(req: Request, res: Response) {
    try {
      const stats = await this.auditService.getStatistics();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}