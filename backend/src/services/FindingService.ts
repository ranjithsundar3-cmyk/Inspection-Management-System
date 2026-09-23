import { getRepository, Repository } from 'typeorm';
import { Finding, FindingStatus, FindingSeverity, FindingCategory } from '../entities/Finding';
import { InspectionService } from './InspectionService';

export interface CreateFindingData {
  title: string;
  description: string;
  observation?: string;
  evidence?: string;
  severity: FindingSeverity;
  category: FindingCategory;
  location?: string;
  dueDate?: Date;
  assignedToId?: number;
  inspectionId: number;
  reportedById?: number;
}

export interface UpdateFindingData {
  title?: string;
  description?: string;
  observation?: string;
  evidence?: string;
  severity?: FindingSeverity;
  status?: FindingStatus;
  category?: FindingCategory;
  location?: string;
  dueDate?: Date;
  resolvedDate?: Date;
  correctiveAction?: string;
  preventiveAction?: string;
  rootCause?: string;
  assignedToId?: number;
  verified?: boolean;
  verifiedById?: number;
}

export class FindingService {
  private get findings(): Repository<Finding> {
    return getRepository(Finding);
  }
  private inspectionService = new InspectionService();

  async getAll(filters: {
    inspectionId?: number;
    status?: FindingStatus;
    severity?: FindingSeverity;
    assignedToId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: Finding[]; total: number; page: number; limit: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const query = this.findings.createQueryBuilder('finding')
      .leftJoinAndSelect('finding.assignedTo', 'assignedTo')
      .leftJoinAndSelect('finding.inspection', 'inspection')
      .leftJoinAndSelect('finding.reportedBy', 'reportedBy');

    if (filters.inspectionId) {
      query.andWhere('finding.inspectionId = :inspectionId', { inspectionId: filters.inspectionId });
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

  async getById(id: number): Promise<Finding> {
    const finding = await this.findings.findOne({
      where: { id },
      relations: ['assignedTo', 'inspection', 'reportedBy'],
    });
    if (!finding) {
      throw new Error('Finding not found');
    }
    return finding;
  }

  async create(data: CreateFindingData): Promise<Finding> {
    const finding = this.findings.create(data);
    const saved = await this.findings.save(finding);
    await this.inspectionService.updateFindingsCount(data.inspectionId);
    return this.getById(saved.id);
  }

  async update(id: number, data: UpdateFindingData): Promise<Finding> {
    const finding = await this.getById(id);
    Object.assign(finding, data);
    await this.findings.save(finding);
    await this.inspectionService.updateFindingsCount(finding.inspectionId);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    const finding = await this.getById(id);
    const inspectionId = finding.inspectionId;
    await this.findings.remove(finding);
    await this.inspectionService.updateFindingsCount(inspectionId);
  }

  async getStatistics(): Promise<any> {
    const total = await this.findings.count();
    const open = await this.findings.count({ where: { status: FindingStatus.OPEN } });
    const inProgress = await this.findings.count({ where: { status: FindingStatus.IN_PROGRESS } });
    const resolved = await this.findings.count({ where: { status: FindingStatus.RESOLVED } });
    const closed = await this.findings.count({ where: { status: FindingStatus.CLOSED } });
    const falsePositive = await this.findings.count({ where: { status: FindingStatus.FALSE_POSITIVE } });

    const critical = await this.findings.count({ where: { severity: FindingSeverity.CRITICAL } });
    const high = await this.findings.count({ where: { severity: FindingSeverity.HIGH } });
    const medium = await this.findings.count({ where: { severity: FindingSeverity.MEDIUM } });
    const low = await this.findings.count({ where: { severity: FindingSeverity.LOW } });

    return {
      total,
      byStatus: { open, inProgress, resolved, closed, falsePositive },
      bySeverity: { critical, high, medium, low },
    };
  }
}