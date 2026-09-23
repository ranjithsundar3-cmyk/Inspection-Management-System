import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Report, ReportFormat, ReportStatus } from '../entities/Report';
import { Inspection } from '../entities/Inspection';
import { Finding } from '../entities/Finding';
import { FindingSeverity, FindingStatus } from '../entities/Finding';

export interface CreateReportData {
  title: string;
  summary?: string;
  format?: ReportFormat;
  inspectionId: number;
  generatedById: number;
}

export class ReportService {
  private get reports(): Repository<Report> {
    return AppDataSource.getRepository(Report);
  }
  private get inspections(): Repository<Inspection> {
    return AppDataSource.getRepository(Inspection);
  }
  private get findings(): Repository<Finding> {
    return AppDataSource.getRepository(Finding);
  }

  async generateReport(inspectionId: number, generatedById: number, format: ReportFormat = ReportFormat.PDF): Promise<Report> {
    const inspection = await this.inspections.findOne({
      where: { id: inspectionId },
      relations: ['assignedInspector', 'createdBy', 'findings'],
    });

    if (!inspection) {
      throw new Error('Inspection not found');
    }

    const findings = await this.findings.find({ where: { inspectionId } });

    const reportData = {
      inspection: {
        id: inspection.id,
        title: inspection.title,
        type: inspection.type,
        status: inspection.status,
        scheduledDate: inspection.scheduledDate,
        completedDate: inspection.completedDate,
        location: inspection.location,
        siteName: inspection.siteName,
        scope: inspection.scope,
        objectives: inspection.objectives,
      },
      summary: {
        totalFindings: findings.length,
        criticalFindings: findings.filter(f => f.severity === FindingSeverity.CRITICAL).length,
        highFindings: findings.filter(f => f.severity === FindingSeverity.HIGH).length,
        mediumFindings: findings.filter(f => f.severity === FindingSeverity.MEDIUM).length,
        lowFindings: findings.filter(f => f.severity === FindingSeverity.LOW).length,
        resolvedFindings: findings.filter(f => f.status === FindingStatus.RESOLVED || f.status === FindingStatus.CLOSED).length,
        openFindings: findings.filter(f => f.status === FindingStatus.OPEN || f.status === FindingStatus.IN_PROGRESS).length,
      },
      findings: findings.map(f => ({
        id: f.id,
        title: f.title,
        description: f.description,
        severity: f.severity,
        status: f.status,
        category: f.category,
        location: f.location,
        dueDate: f.dueDate,
        correctiveAction: f.correctiveAction,
        preventiveAction: f.preventiveAction,
      })),
    };

    const report = this.reports.create({
      title: `Inspection Report - ${inspection.title}`,
      summary: `Report for inspection: ${inspection.title}`,
      format,
      status: ReportStatus.GENERATED,
      generatedDate: new Date(),
      inspectionId,
      generatedById,
      data: reportData,
      totalFindings: reportData.summary.totalFindings,
      criticalFindings: reportData.summary.criticalFindings,
      highFindings: reportData.summary.highFindings,
      mediumFindings: reportData.summary.mediumFindings,
      lowFindings: reportData.summary.lowFindings,
      resolvedFindings: reportData.summary.resolvedFindings,
      openFindings: reportData.summary.openFindings,
    });

    const savedReport = await this.reports.save(report);

    inspection.reportGenerated = true;
    inspection.reportId = savedReport.id;
    await this.inspections.save(inspection);

    return savedReport;
  }

  async getAll(filters: {
    inspectionId?: number;
    format?: ReportFormat;
    status?: ReportStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: Report[]; total: number; page: number; limit: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const query = this.reports.createQueryBuilder('report')
      .leftJoinAndSelect('report.inspection', 'inspection')
      .leftJoinAndSelect('report.generatedBy', 'generatedBy');

    if (filters.inspectionId) {
      query.andWhere('report.inspectionId = :inspectionId', { inspectionId: filters.inspectionId });
    }
    if (filters.format) {
      query.andWhere('report.format = :format', { format: filters.format });
    }
    if (filters.status) {
      query.andWhere('report.status = :status', { status: filters.status });
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    return { data, total, page, limit };
  }

  async getById(id: number): Promise<Report> {
    const report = await this.reports.findOne({
      where: { id },
      relations: ['inspection', 'generatedBy'],
    });
    if (!report) {
      throw new Error('Report not found');
    }
    return report;
  }

  async updateStatus(id: number, status: ReportStatus): Promise<Report> {
    const report = await this.getById(id);
    report.status = status;
    if (status === ReportStatus.PUBLISHED) {
      report.publishedDate = new Date();
    }
    await this.reports.save(report);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    const report = await this.getById(id);
    await this.reports.remove(report);
  }
}