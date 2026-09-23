import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import { User } from '../entities/User';
import { Inspection } from '../entities/Inspection';
import { Finding } from '../entities/Finding';
import { Report } from '../entities/Report';
import { Audit } from '../entities/Audit';
import { AuditFinding } from '../entities/AuditFinding';

const dbPath = (() => {
  if (typeof __dirname !== 'undefined') {
    return path.resolve(__dirname, '../../database/inspection.db');
  }
  return './database/inspection.db';
})();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbPath,
  synchronize: true,
  logging: false,
  entities: [User, Inspection, Finding, Report, Audit, AuditFinding],
  migrations: [],
  subscribers: [],
});

export default AppDataSource;