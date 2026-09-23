import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Inspection } from './Inspection';
import { User } from './User';

export enum FindingSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  INFO = 'info',
}

export enum FindingStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  FALSE_POSITIVE = 'false_positive',
}

export enum FindingCategory {
  SAFETY = 'safety',
  COMPLIANCE = 'compliance',
  QUALITY = 'quality',
  SECURITY = 'security',
  ENVIRONMENTAL = 'environmental',
  OPERATIONAL = 'operational',
}

@Entity('findings')
export class Finding {
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

  @Column()
  severity: string;

  @Column({ default: 'open' })
  status: string;

  @Column()
  category: string;

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

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  verifiedById: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @Column({ nullable: true })
  assignedToId: number;

  @ManyToOne(() => Inspection, (inspection) => inspection.findings)
  @JoinColumn({ name: 'inspectionId' })
  inspection: Inspection;

  @Column()
  inspectionId: number;

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