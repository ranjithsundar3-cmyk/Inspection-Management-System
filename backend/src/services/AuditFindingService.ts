import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { AuditFinding, AuditFindingStatus, AuditFindingSeverity, AuditFindingCategory } from '../entities/AuditFinding';
import { AuditService } from './AuditService';

export interface CreateAuditFindingData {
  title: string;
  description: string;
  observation?: string;
  evidence?: string;
  severity: AuditFindingSeverity;
  category: AuditFindingCategory;
  location?: string;
  dueDate?: Date;
  assignedToId?: number;
  auditId: number;
  reportedById?: number;
}

export interface UpdateAuditFindingData {
  title?: string;
  description?: string;
  observation?: string;
  evidence?: string;
  severity?: AuditFindingSeverity;
  status?: AuditFindingStatus;
  category?: AuditFindingCategory;
  location?: string;
  dueDate?: Date;
  resolvedDate?: Date;
  correctiveAction?: string;
  preventiveAction?: string;
  recommendation?: string;
  rootCause?: string;
  assignedToId?: number;
  verified?: boolean;
  verifiedById?: number;
}

export class AuditFindingService {
  private get findings(): Repository<AuditFinding> {
    return AppDataSource.getRepository(AuditFinding);
  }
  private auditService = new AuditService();

  async getAll(filters: {
    auditId?: number;
    status?: AuditFindingStatus;
    severity?: AuditFindingSeverity;
    assignedToId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: AuditFinding[]; total: number; page: number; limit: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const query = this.findings.createQueryBuilder('finding')
      .leftJoinAndSelect('finding.assignedTo', 'assignedTo')
      .leftJoinAndSelect('finding.audit', 'audit')
      .leftJoinAndSelect('finding.reportedBy', 'reportedBy');

    if (filters.auditId) {
      query.andWhere('finding.auditId = :auditId', { auditId: filters.auditId });
    }
    if (filters.status) {
      query.andWhere('finding.status = :status', { status: filters.status });
    }
    if (filters.severity) {
      query.andWhere('finding.severity = :severity', { severity: filters.severity });
    }
    if (filters.assignedToId) {
      query.andWhere('finding.assignedToId = :assignedToId', { assignedToId: filters.assignedToId });
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    return { data, total, page, limit };
  }

  async getById(id: number): Promise<AuditFinding> {
    const finding = await this.findings.findOne({
      where: { id },
      relations: ['assignedTo', 'audit', 'reportedBy'],
    });
    if (!finding) {
      throw new Error('Audit finding not found');
    }
    return finding;
  }

  async create(data: CreateAuditFindingData): Promise<AuditFinding> {
    const finding = this.findings.create(data);
    const saved = await this.findings.save(finding);
    await this.auditService.updateFindingsCount(data.auditId);
    return this.getById(saved.id);
  }

  async update(id: number, data: UpdateAuditFindingData): Promise<AuditFinding> {
    const finding = await this.getById(id);
    Object.assign(finding, data);
    await this.findings.save(finding);
    await this.auditService.updateFindingsCount(finding.auditId);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    const finding = await this.getById(id);
    const auditId = finding.auditId;
    await this.findings.remove(finding);
    await this.auditService.updateFindingsCount(auditId);
  }

  async getStatistics(): Promise<any> {
    const total = await this.findings.count();
    const open = await this.findings.count({ where: { status: AuditFindingStatus.OPEN } });
    const inProgress = await this.findings.count({ where: { status: AuditFindingStatus.IN_PROGRESS } });
    const resolved = await this.findings.count({ where: { status: AuditFindingStatus.RESOLVED } });
    const closed = await this.findings.count({ where: { status: AuditFindingStatus.CLOSED } });
    const falsePositive = await this.findings.count({ where: { status: AuditFindingStatus.FALSE_POSITIVE } });

    const critical = await this.findings.count({ where: { severity: AuditFindingSeverity.CRITICAL } });
    const high = await this.findings.count({ where: { severity: AuditFindingSeverity.HIGH } });
    const medium = await this.findings.count({ where: { severity: AuditFindingSeverity.MEDIUM } });
    const low = await this.findings.count({ where: { severity: AuditFindingSeverity.LOW } });

    return {
      total,
      byStatus: { open, inProgress, resolved, closed, falsePositive },
      bySeverity: { critical, high, medium, low },
    };
  }
}