import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/pagination';
import { User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<PageResponse<User>> {
    return this.http.get<PageResponse<User>>(`${environment.baseUrl}/users`, { params: params || {} });
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.baseUrl}/users/${id}`);
  }

  create(data: any): Observable<User> {
    return this.http.post<User>(`${environment.baseUrl}/users`, data);
  }

  update(id: number, data: any): Observable<User> {
    return this.http.put<User>(`${environment.baseUrl}/users/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/users/${id}`);
  }
}