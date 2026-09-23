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

export enum InspectionType {
  ROUTINE = 'routine',
  COMPLIANCE = 'compliance',
  SPOT = 'spot',
  FOLLOW_UP = 'follow_up',
}

export enum InspectionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  OVERDUE = 'overdue',
}

export enum InspectionPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('inspections')
export class Inspection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: InspectionType, default: InspectionType.ROUTINE })
  type: InspectionType;

  @Column({ type: 'enum', enum: InspectionStatus, default: InspectionStatus.SCHEDULED })
  status: InspectionStatus;

  @Column({ type: 'enum', enum: InspectionPriority, default: InspectionPriority.MEDIUM })
  priority: InspectionPriority;

  @Column({ type: 'date' })
  scheduledDate: Date;

  @Column({ type: 'date', nullable: true })
  completedDate: Date;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  siteName: string;

  @Column({ type: 'text', nullable: true })
  scope: string;

  @Column({ type: 'text', nullable: true })
  objectives: string;

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

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'assignedInspectorId' })
  assignedInspector: User;

  @Column({ nullable: true })
  assignedInspectorId: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: number;

  @OneToMany(() => Finding, (finding) => finding.inspection)
  findings: Finding[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}