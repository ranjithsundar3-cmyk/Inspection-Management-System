import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { getRepository, Repository } from 'typeorm';
import { User } from '../entities/User';

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: any;
}

export class AuthService {
  private get users(): Repository<User> {
    return getRepository(User);
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    organization?: string;
    position?: string;
    role?: string;
  }): Promise<AuthResponse> {
    const existingUser = await this.users.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = this.users.create({
      ...data,
      role: data.role || 'inspector',
      status: 'active',
    });

    await this.users.save(user);

    const token = this.generateToken(user);
    return { token, user: user.toJSON() };
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const user = await this.users.findOne({ where: { email: data.email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.status === 'suspended') {
      throw new Error('Account is suspended');
    }

    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user);
    return { token, user: user.toJSON() };
  }

  generateToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
    });
  }

  verifyToken(token: string): JWTPayload {
    return jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as JWTPayload;
  }

  async getCurrentUser(userId: number): Promise<any> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  }

  async updateUser(userId: number, data: Partial<User>): Promise<any> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }

    Object.assign(user, data);
    await this.users.save(user);
    return user.toJSON();
  }
}