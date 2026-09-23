import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { AuthController } from '../controllers/AuthController';
import { InspectionController } from '../controllers/InspectionController';
import { FindingController } from '../controllers/FindingController';
import { ReportController } from '../controllers/ReportController';
import { AuditController } from '../controllers/AuditController';
import { AuditFindingController } from '../controllers/AuditFindingController';

export const router = Router();

const authController = new AuthController();
const inspectionController = new InspectionController();
const findingController = new FindingController();
const reportController = new ReportController();
const auditController = new AuditController();
const auditFindingController = new AuditFindingController();

// Auth routes
router.post('/auth/register', authorize('admin'), authController.register.bind(authController));
router.post('/auth/login', authController.login.bind(authController));
router.get('/auth/me', authenticate, authController.me.bind(authController));
router.put('/auth/me', authenticate, authController.updateProfile.bind(authController));

// Inspection routes
router.get('/inspections', authenticate, inspectionController.getAll.bind(inspectionController));
router.get('/inspections/:id', authenticate, inspectionController.getById.bind(inspectionController));
router.post('/inspections', authenticate, inspectionController.create.bind(inspectionController));
router.put('/inspections/:id', authenticate, inspectionController.update.bind(inspectionController));
router.delete('/inspections/:id', authenticate, authorize('admin', 'inspector'), inspectionController.delete.bind(inspectionController));
router.get('/inspections/statistics', authenticate, inspectionController.getStatistics.bind(inspectionController));

// Finding routes
router.get('/findings', authenticate, findingController.getAll.bind(findingController));
router.get('/findings/:id', authenticate, findingController.getById.bind(findingController));
router.post('/findings', authenticate, findingController.create.bind(findingController));
router.put('/findings/:id', authenticate, findingController.update.bind(findingController));
router.delete('/findings/:id', authenticate, authorize('admin', 'inspector', 'auditor'), findingController.delete.bind(findingController));
router.get('/findings/statistics', authenticate, findingController.getStatistics.bind(findingController));

// Report routes
router.post('/reports/generate', authenticate, reportController.generate.bind(reportController));
router.get('/reports', authenticate, reportController.getAll.bind(reportController));
router.get('/reports/:id', authenticate, reportController.getById.bind(reportController));
router.put('/reports/:id', authenticate, reportController.updateStatus.bind(reportController));
router.delete('/reports/:id', authenticate, authorize('admin'), reportController.delete.bind(reportController));

// Audit routes
router.get('/audits', authenticate, auditController.getAll.bind(auditController));
router.get('/audits/:id', authenticate, auditController.getById.bind(auditController));
router.post('/audits', authenticate, authorize('admin', 'auditor'), auditController.create.bind(auditController));
router.put('/audits/:id', authenticate, authorize('admin', 'auditor'), auditController.update.bind(auditController));
router.delete('/audits/:id', authenticate, authorize('admin'), auditController.delete.bind(auditController));
router.post('/audits/:id/auditors', authenticate, authorize('admin', 'auditor'), auditController.addAuditors.bind(auditController));
router.delete('/audits/:id/auditors/:auditorId', authenticate, authorize('admin', 'auditor'), auditController.removeAuditor.bind(auditController));
router.get('/audits/statistics', authenticate, auditController.getStatistics.bind(auditController));

// Audit Finding routes
router.get('/audit-findings', authenticate, auditFindingController.getAll.bind(auditFindingController));
router.get('/audit-findings/:id', authenticate, auditFindingController.getById.bind(auditFindingController));
router.post('/audit-findings', authenticate, authorize('admin', 'auditor'), auditFindingController.create.bind(auditFindingController));
router.put('/audit-findings/:id', authenticate, authorize('admin', 'auditor'), auditFindingController.update.bind(auditFindingController));
router.delete('/audit-findings/:id', authenticate, authorize('admin', 'auditor'), auditFindingController.delete.bind(auditFindingController));
router.get('/audit-findings/statistics', authenticate, auditFindingController.getStatistics.bind(auditFindingController));

export default router;