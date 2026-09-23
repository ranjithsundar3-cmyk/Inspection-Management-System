import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Audit } from './Audit';
import { User } from './User';

export enum AuditFindingSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

export enum AuditFindingStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  FALSE_POSITIVE = 'false_positive',
}

export enum AuditFindingCategory {
  COMPLIANCE = 'compliance',
  PROCESS = 'process',
  CONTROL_GAP = 'control_gap',
  DATA_INTEGRITY = 'data_integrity',
  RISK = 'risk',
}

@Entity('audit_findings')
export class AuditFinding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  observation: string;

  @Column({ type: 'text', nullable: true })
  evidence: string;

  @Column({ type: 'enum', enum: AuditFindingSeverity })
  severity: AuditFindingSeverity;

  @Column({ type: 'enum', enum: AuditFindingStatus, default: AuditFindingStatus.OPEN })
  status: AuditFindingStatus;

  @Column({ type: 'enum', enum: AuditFindingCategory })
  category: AuditFindingCategory;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  resolvedDate: Date;

  @Column({ type: 'text', nullable: true })
  correctiveAction: string;

  @Column({ type: 'text', nullable: true })
  preventiveAction: string;

  @Column({ type: 'text', nullable: true })
  rootCause: string;

  @Column({ type: 'text', nullable: true })
  recommendation: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  verifiedById: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @Column({ nullable: true })
  assignedToId: number;

  @ManyToOne(() => Audit, (audit) => audit.findings)
  @JoinColumn({ name: 'auditId' })
  audit: Audit;

  @Column()
  auditId: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'reportedById' })
  reportedBy: User;

  @Column({ nullable: true })
  reportedById: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}