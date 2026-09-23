import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { Audit, AuditStatus, AuditType, AuditScope } from '../entities/Audit';
import { AuditFinding, AuditFindingStatus, AuditFindingSeverity } from '../entities/AuditFinding';
import { User } from '../entities/User';

export interface CreateAuditData {
  title: string;
  description?: string;
  type?: AuditType;
  plannedStartDate: Date;
  plannedEndDate: Date;
  scope?: AuditScope;
  criteria?: string;
  standards?: string;
  siteName?: string;
  location?: string;
  leadAuditorId?: number;
  createdById?: number;
  auditorIds?: number[];
}

export interface UpdateAuditData {
  title?: string;
  description?: string;
  type?: AuditType;
  status?: AuditStatus;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  scope?: AuditScope;
  criteria?: string;
  standards?: string;
  siteName?: string;
  location?: string;
  leadAuditorId?: number;
}

export class AuditService {
  private get audits(): Repository<Audit> {
    return AppDataSource.getRepository(Audit);
  }
  private get auditFindings(): Repository<AuditFinding> {
    return AppDataSource.getRepository(AuditFinding);
  }
  private get users(): Repository<User> {
    return AppDataSource.getRepository(User);
  }

  async getAll(filters: {
    status?: AuditStatus;
    type?: AuditType;
    leadAuditorId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: Audit[]; total: number; page: number; limit: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const query = this.audits.createQueryBuilder('audit')
      .leftJoinAndSelect('audit.leadAuditor', 'leadAuditor')
      .leftJoinAndSelect('audit.auditors', 'auditors')
      .leftJoinAndSelect('audit.createdBy', 'createdBy');

    if (filters.status) {
      query.andWhere('audit.status = :status', { status: filters.status });
    }
    if (filters.type) {
      query.andWhere('audit.type = :type', { type: filters.type });
    }
    if (filters.leadAuditorId) {
      query.andWhere('audit.leadAuditorId = :leadAuditorId', { leadAuditorId: filters.leadAuditorId });
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    return { data, total, page, limit };
  }

  async getById(id: number): Promise<Audit> {
    const audit = await this.audits.findOne({
      where: { id },
      relations: ['leadAuditor', 'auditors', 'createdBy', 'findings'],
    });
    if (!audit) {
      throw new Error('Audit not found');
    }
    return audit;
  }

  async create(data: CreateAuditData): Promise<Audit> {
    const { auditorIds, ...auditData } = data;
    const audit = this.audits.create(auditData);

    if (auditorIds && auditorIds.length > 0) {
      const auditors = await this.users.findByIds(auditorIds);
      audit.auditors = auditors;
    }

    await this.audits.save(audit);
    return this.getById(audit.id);
  }

  async update(id: number, data: UpdateAuditData): Promise<Audit> {
    const audit = await this.getById(id);
    Object.assign(audit, data);
    await this.audits.save(audit);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    const audit = await this.getById(id);
    await this.audits.remove(audit);
  }

  async addAuditors(id: number, auditorIds: number[]): Promise<Audit> {
    const audit = await this.getById(id);
    const auditors = await this.users.findByIds(auditorIds);
    audit.auditors = [...audit.auditors, ...auditors];
    await this.audits.save(audit);
    return this.getById(id);
  }

  async removeAuditor(id: number, auditorId: number): Promise<Audit> {
    const audit = await this.getById(id);
    audit.auditors = audit.auditors.filter(a => a.id !== auditorId);
    await this.audits.save(audit);
    return this.getById(id);
  }

  async updateFindingsCount(id: number): Promise<void> {
    const audit = await this.getById(id);
    const findings = await this.auditFindings.find({ where: { auditId: id } });

    audit.totalFindings = findings.length;
    audit.criticalFindings = findings.filter(f => f.severity === AuditFindingSeverity.CRITICAL).length;
    audit.highFindings = findings.filter(f => f.severity === AuditFindingSeverity.HIGH).length;
    audit.mediumFindings = findings.filter(f => f.severity === AuditFindingSeverity.MEDIUM).length;
    audit.lowFindings = findings.filter(f => f.severity === AuditFindingSeverity.LOW).length;
    audit.resolvedFindings = findings.filter(f => f.status === AuditFindingStatus.RESOLVED || f.status === AuditFindingStatus.CLOSED).length;

    await this.audits.save(audit);
  }

  async getStatistics(): Promise<any> {
    const total = await this.audits.count();
    const planning = await this.audits.count({ where: { status: AuditStatus.PLANNING } });
    const inProgress = await this.audits.count({ where: { status: AuditStatus.IN_PROGRESS } });
    const onHold = await this.audits.count({ where: { status: AuditStatus.ON_HOLD } });
    const completed = await this.audits.count({ where: { status: AuditStatus.COMPLETED } });
    const cancelled = await this.audits.count({ where: { status: AuditStatus.CANCELLED } });

    return {
      total,
      planning,
      inProgress,
      onHold,
      completed,
      cancelled,
    };
  }
}