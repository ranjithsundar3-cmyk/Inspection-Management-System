import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Inspection } from './Inspection';
import { User } from './User';

export enum ReportFormat {
  PDF = 'pdf',
  HTML = 'html',
  EXCEL = 'excel',
  WORD = 'word',
}

export enum ReportStatus {
  DRAFT = 'draft',
  GENERATED = 'generated',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ default: 'pdf' })
  format: string;

  @Column({ default: 'draft' })
  status: string;

  @Column({ type: 'date' })
  generatedDate: Date;

  @Column({ type: 'date', nullable: true })
  publishedDate: Date;

  @Column({ nullable: true })
  filePath: string;

  @Column({ type: 'json', nullable: true })
  data: any;

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

  @Column({ default: 0 })
  openFindings: number;

  @OneToOne(() => Inspection, (inspection) => inspection.reportId, { nullable: true })
  @JoinColumn({ name: 'inspectionId' })
  inspection: Inspection;

  @Column({ nullable: true })
  inspectionId: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'generatedById' })
  generatedBy: User;

  @Column({ nullable: true })
  generatedById: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}