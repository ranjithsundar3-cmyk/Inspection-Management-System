import { getRepository, Repository } from 'typeorm';
import { Inspection } from '../entities/Inspection';
import { Finding } from '../entities/Finding';
import { User } from '../entities/User';

export interface CreateInspectionData {
  title: string;
  description?: string;
  type?: string;
  priority?: string;
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
  type?: string;
  status?: string;
  priority?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  location?: string;
  siteName?: string;
  scope?: string;
  objectives?: string;
  assignedInspectorId?: number;
}

export class InspectionService {
  private get inspections(): Repository<Inspection> {
    return getRepository(Inspection);
  }
  private get findings(): Repository<Finding> {
    return getRepository(Finding);
  }
  private get users(): Repository<User> {
    return getRepository(User);
  }

  async getAll(filters: {
    status?: string;
    type?: string;
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
    inspection.criticalFindings = findings.filter(f => f.severity === 'critical').length;
    inspection.highFindings = findings.filter(f => f.severity === 'high').length;
    inspection.mediumFindings = findings.filter(f => f.severity === 'medium').length;
    inspection.lowFindings = findings.filter(f => f.severity === 'low').length;
    inspection.resolvedFindings = findings.filter(f => f.status === 'resolved' || f.status === 'closed').length;

    await this.inspections.save(inspection);
  }

  async getStatistics(): Promise<any> {
    const total = await this.inspections.count();
    const scheduled = await this.inspections.count({ where: { status: 'scheduled' } });
    const inProgress = await this.inspections.count({ where: { status: 'in_progress' } });
    const completed = await this.inspections.count({ where: { status: 'completed' } });
    const cancelled = await this.inspections.count({ where: { status: 'cancelled' } });

    return {
      total,
      scheduled,
      inProgress,
      completed,
      cancelled,
    };
  }
}