import { getRepository, Repository, Between, LessThan } from 'typeorm';
import { Inspection, InspectionStatus, InspectionType, InspectionPriority } from '../entities/Inspection';
import { Finding, FindingStatus, FindingSeverity } from '../entities/Finding';
import { User } from '../entities/User';

export interface CreateInspectionData {
  title: string;
  description?: string;
  type?: InspectionType;
  priority?: InspectionPriority;
  scheduledDate: Date;
  location?: string;
  siteName?: string;
  scope?: string;
  objectives?: string;
  assignedInspectorId?: number;
  createdById?: number;
}

export interface UpdateInspectionData {
  title?: string;
  description?: string;
  type?: InspectionType;
  status?: InspectionStatus;
  priority?: InspectionPriority;
  scheduledDate?: Date;
  completedDate?: Date;
  location?: string;
  siteName?: string;
  scope?: string;
  objectives?: string;
  assignedInspectorId?: number;
}

export class InspectionService {
  private inspections = getRepository(Inspection);
  private findings = getRepository(Finding);
  private users = getRepository(User);

  async getAll(filters: {
    status?: InspectionStatus;
    type?: InspectionType;
    assignedInspectorId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: Inspection[]; total: number; page: number; limit: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

const query = this.inspections.createQueryBuilder('inspection')
      .leftJoinAndSelect('inspection.assignedInspector', 'inspector')
      .leftJoinAndSelect('inspection.createdBy', 'creator');

    if (filters.status) {
      query.andWhere('inspection.status = :status', { status: filters.status });
    }
    if (filters.type) {
      query.andWhere('inspection.type = :type', { type: filters.type });
    }
    if (filters.assignedInspectorId) {
      query.andWhere('inspection.assignedInspectorId = :inspectorId', { inspectorId: filters.assignedInspectorId });
    }

    const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

    return { data, total, page, limit };
  }

  async getById(id: number): Promise<Inspection> {
    const inspection = await this.inspections.findOne({
      where: { id },
      relations: ['assignedInspector', 'createdBy', 'findings'],
    });
    if (!inspection) {
      throw new Error('Inspection not found');
    }
    return inspection;
  }

  async create(data: CreateInspectionData): Promise<Inspection> {
    const inspection = this.inspections.create(data);
    await this.inspections.save(inspection);
    return this.getById(inspection.id);
  }

  async update(id: number, data: UpdateInspectionData): Promise<Inspection> {
    const inspection = await this.getById(id);
    Object.assign(inspection, data);
    await this.inspections.save(inspection);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    const inspection = await this.getById(id);
    await this.inspections.remove(inspection);
  }

  async updateFindingsCount(id: number): Promise<void> {
    const inspection = await this.getById(id);
    const findings = await this.findings.find({ where: { inspectionId: id } });

    inspection.totalFindings = findings.length;
    inspection.criticalFindings = findings.filter(f => f.severity === FindingSeverity.CRITICAL).length;
    inspection.highFindings = findings.filter(f => f.severity === FindingSeverity.HIGH).length;
    inspection.mediumFindings = findings.filter(f => f.severity === FindingSeverity.MEDIUM).length;
    inspection.lowFindings = findings.filter(f => f.severity === FindingSeverity.LOW).length;
    inspection.resolvedFindings = findings.filter(f => f.status === FindingStatus.RESOLVED || f.status === FindingStatus.CLOSED).length;

    await this.inspections.save(inspection);
  }

  async getStatistics(): Promise<any> {
    const total = await this.inspections.count();
    const scheduled = await this.inspections.count({ where: { status: InspectionStatus.SCHEDULED } });
    const inProgress = await this.inspections.count({ where: { status: InspectionStatus.IN_PROGRESS } });
    const completed = await this.inspections.count({ where: { status: InspectionStatus.COMPLETED } });
    const cancelled = await this.inspections.count({ where: { status: InspectionStatus.CANCELLED } });

    return {
      total,
      scheduled,
      inProgress,
      completed,
      cancelled,
    };
  }
}