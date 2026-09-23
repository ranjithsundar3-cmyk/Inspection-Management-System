import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './User';

export enum AuditType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  CERTIFICATION = 'certification',
  REGULATORY = 'regulatory',
}

export enum AuditStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum AuditScope {
  QUALITY = 'quality',
  SAFETY = 'safety',
  ENVIRONMENTAL = 'environmental',
  FINANCIAL = 'financial',
  INFORMATION_SECURITY = 'information_security',
  OPERATIONAL = 'operational',
}

@Entity('audits')
export class Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: AuditType, default: AuditType.INTERNAL })
  type: AuditType;

  @Column({ type: 'enum', enum: AuditStatus, default: AuditStatus.PLANNING })
  status: AuditStatus;

  @Column({ type: 'date' })
  plannedStartDate: Date;

  @Column({ type: 'date' })
  plannedEndDate: Date;

  @Column({ type: 'date', nullable: true })
  actualStartDate: Date;

  @Column({ type: 'date', nullable: true })
  actualEndDate: Date;

  @Column({ type: 'enum', enum: AuditScope, default: AuditScope.OPERATIONAL })
  scope: AuditScope;

  @Column({ type: 'text', nullable: true })
  criteria: string;

  @Column({ type: 'text', nullable: true })
  standards: string;

  @Column({ nullable: true })
  siteName: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: 0 })
  totalFindings: number;

  @Column({ default: 0 })
  criticalFindings: number;

  @Column({ default: 0 })
  highFindings: number;

  @Column({ default: 0 })
  mediumFindings: number;

  @Column({ default: 0 })
  lowFindings: number;

  @Column({ default: 0 })
  resolvedFindings: number;

  @Column({ default: false })
  reportGenerated: boolean;

  @Column({ nullable: true })
  reportId: number;

  @ManyToMany(() => User, (user) => user.id)
  @JoinTable({ name: 'audit_auditors' })
  auditors: User[];

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'leadAuditorId' })
  leadAuditor: User;

  @Column({ nullable: true })
  leadAuditorId: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: number;

  @OneToMany(() => AuditFinding, (finding) => finding.audit)
  findings: AuditFinding[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}