import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  organization: string;
  position: string;
  role: 'admin' | 'inspector' | 'auditor' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  organization?: string;
  position?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = this.getUserFromStorage();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.baseUrl}/auth/login`, credentials);
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.baseUrl}/auth/register`, data);
  }

  me(): Observable<User> {
    return this.http.get<User>(`${environment.baseUrl}/auth/me`);
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${environment.baseUrl}/auth/me`, data);
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }

  hasRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}