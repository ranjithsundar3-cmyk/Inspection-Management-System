import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private svc = new AuthService();

  async register(req: Request, res: Response) {
    try {
      const result = await this.svc.register(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await this.svc.login(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const user = await this.svc.getCurrentUser(authReq.user.userId);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const user = await this.svc.updateUser(authReq.user.userId, req.body);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}