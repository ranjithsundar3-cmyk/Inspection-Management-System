import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { AuthController } from '../controllers/AuthController';
import { InspectionController } from '../controllers/InspectionController';
import { FindingController } from '../controllers/FindingController';
import { ReportController } from '../controllers/ReportController';
import { AuditController } from '../controllers/AuditController';
import { AuditFindingController } from '../controllers/AuditFindingController';

export const router = Router();

// Auth routes
router.post('/auth/register', (req, res) => new AuthController().register(req, res));
router.post('/auth/login', (req, res) => new AuthController().login(req, res));
router.get('/auth/me', authenticate, (req, res) => new AuthController().me(req, res));
router.put('/auth/me', authenticate, (req, res) => new AuthController().updateProfile(req, res));

// Inspection routes
router.get('/inspections', authenticate, (req, res) => new InspectionController().getAll(req, res));
router.get('/inspections/:id', authenticate, (req, res) => new InspectionController().getById(req, res));
router.post('/inspections', authenticate, (req, res) => new InspectionController().create(req, res));
router.put('/inspections/:id', authenticate, (req, res) => new InspectionController().update(req, res));
router.delete('/inspections/:id', authenticate, authorize('admin', 'inspector'), (req, res) => new InspectionController().delete(req, res));
router.get('/inspections/statistics', authenticate, (req, res) => new InspectionController().getStatistics(req, res));

// Finding routes
router.get('/findings', authenticate, (req, res) => new FindingController().getAll(req, res));
router.get('/findings/:id', authenticate, (req, res) => new FindingController().getById(req, res));
router.post('/findings', authenticate, (req, res) => new FindingController().create(req, res));
router.put('/findings/:id', authenticate, (req, res) => new FindingController().update(req, res));
router.delete('/findings/:id', authenticate, authorize('admin', 'inspector', 'auditor'), (req, res) => new FindingController().delete(req, res));
router.get('/findings/statistics', authenticate, (req, res) => new FindingController().getStatistics(req, res));

// Report routes
router.post('/reports/generate', authenticate, (req, res) => new ReportController().generate(req, res));
router.get('/reports', authenticate, (req, res) => new ReportController().getAll(req, res));
router.get('/reports/:id', authenticate, (req, res) => new ReportController().getById(req, res));
router.put('/reports/:id', authenticate, (req, res) => new ReportController().updateStatus(req, res));
router.delete('/reports/:id', authenticate, authorize('admin'), (req, res) => new ReportController().delete(req, res));

// Audit routes
router.get('/audits', authenticate, (req, res) => new AuditController().getAll(req, res));
router.get('/audits/:id', authenticate, (req, res) => new AuditController().getById(req, res));
router.post('/audits', authenticate, authorize('admin', 'auditor'), (req, res) => new AuditController().create(req, res));
router.put('/audits/:id', authenticate, authorize('admin', 'auditor'), (req, res) => new AuditController().update(req, res));
router.delete('/audits/:id', authenticate, authorize('admin'), (req, res) => new AuditController().delete(req, res));
router.post('/audits/:id/auditors', authenticate, authorize('admin', 'auditor'), (req, res) => new AuditController().addAuditors(req, res));
router.delete('/audits/:id/auditors/:auditorId', authenticate, authorize('admin', 'auditor'), (req, res) => new AuditController().removeAuditor(req, res));
router.get('/audits/statistics', authenticate, (req, res) => new AuditController().getStatistics(req, res));

// Audit Finding routes
router.get('/audit-findings', authenticate, (req, res) => new AuditFindingController().getAll(req, res));
router.get('/audit-findings/:id', authenticate, (req, res) => new AuditFindingController().getById(req, res));
router.post('/audit-findings', authenticate, authorize('admin', 'auditor'), (req, res) => new AuditFindingController().create(req, res));
router.put('/audit-findings/:id', authenticate, authorize('admin', 'auditor'), (req, res) => new AuditFindingController().update(req, res));
router.delete('/audit-findings/:id', authenticate, authorize('admin', 'auditor'), (req, res) => new AuditFindingController().delete(req, res));
router.get('/audit-findings/statistics', authenticate, (req, res) => new AuditFindingController().getStatistics(req, res));

export default router;