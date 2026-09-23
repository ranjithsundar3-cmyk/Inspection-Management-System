import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../src/entities/User';
import { Inspection } from '../src/entities/Inspection';
import { Finding } from '../src/entities/Finding';
import { Report } from '../src/entities/Report';
import { Audit } from '../src/entities/Audit';
import { AuditFinding } from '../src/entities/AuditFinding';

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