import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Inspection } from '../entities/Inspection';
import { Finding } from '../entities/Finding';
import { Report } from '../entities/Report';
import { Audit } from '../entities/Audit';
import { AuditFinding } from '../entities/AuditFinding';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: './database/inspection.db',
  synchronize: true,
  logging: false,
  entities: [User, Inspection, Finding, Report, Audit, AuditFinding],
  migrations: [],
  subscribers: [],
});

export default AppDataSource;