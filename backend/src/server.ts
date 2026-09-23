import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import { AppDataSource } from '../database/data-source';
import router from './routes';
import path from 'path';

dotenv.config();

export class Server {
  public app: Application;
  public port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001', 10);
    this.middleware();
    this.routes();
  }

  private middleware() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(morgan('dev'));
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  }

  private routes() {
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'OK', message: 'Inspection/Audit Management System API' });
    });

    this.app.use('/api/v1', router);

    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({ error: 'Route not found' });
    });

    this.app.use((err: any, req: Request, res: Response, next: any) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Something went wrong!' });
    });
  }

  private async database() {
    try {
      await AppDataSource.initialize();
      console.log('Database connection established successfully');
    } catch (error) {
      console.error('Error connecting to database:', error);
      process.exit(1);
    }
  }

  public async start() {
    await this.database();
    this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
      console.log(`API available at http://localhost:${this.port}/api/v1`);
    });
  }
}

if (require.main === module) {
  const server = new Server();
  server.start().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}