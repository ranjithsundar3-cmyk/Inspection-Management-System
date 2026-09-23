import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User, UserRole, UserStatus } from '../entities/User';

export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export class AuthService {
  private users = getRepository(User);

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    organization?: string;
    position?: string;
    role?: UserRole;
  }): Promise<AuthResponse> {
    const existingUser = await this.users.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = this.users.create({
      ...data,
      role: data.role || UserRole.INSPECTOR,
      status: UserStatus.ACTIVE,
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

    if (user.status === UserStatus.SUSPENDED) {
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

  async getCurrentUser(userId: number): Promise<Omit<User, 'password'>> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return user.toJSON();
  }

  async updateUser(userId: number, data: Partial<User>): Promise<Omit<User, 'password'>> {
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