import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/pagination';

export interface Audit {
  id: number;
  title: string;
  description: string;
  type: 'internal' | 'external' | 'certification' | 'regulatory';
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate: Date;
  actualEndDate: Date;
  scope: 'quality' | 'safety' | 'environmental' | 'financial' | 'information_security' | 'operational';
  criteria: string;
  standards: string;
  siteName: string;
  location: string;
  totalFindings: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  resolvedFindings: number;
  reportGenerated: boolean;
  reportId: number;
  leadAuditorId: number;
  createdById: number;
  auditors: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface CreateAuditRequest {
  title: string;
  description?: string;
  type?: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  scope?: string;
  criteria?: string;
  standards?: string;
  siteName?: string;
  location?: string;
  leadAuditorId?: number;
  auditorIds?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<PageResponse<Audit>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, String(params[key]));
        }
      });
    }
    return this.http.get<PageResponse<Audit>>(`${environment.baseUrl}/audits`, { params: httpParams });
  }

  getById(id: number): Observable<Audit> {
    return this.http.get<Audit>(`${environment.baseUrl}/audits/${id}`);
  }

  create(data: CreateAuditRequest): Observable<Audit> {
    return this.http.post<Audit>(`${environment.baseUrl}/audits`, data);
  }

  update(id: number, data: any): Observable<Audit> {
    return this.http.put<Audit>(`${environment.baseUrl}/audits/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/audits/${id}`);
  }

  addAuditors(id: number, auditorIds: number[]): Observable<Audit> {
    return this.http.post<Audit>(`${environment.baseUrl}/audits/${id}/auditors`, { auditorIds });
  }

  removeAuditor(id: number, auditorId: number): Observable<Audit> {
    return this.http.delete<Audit>(`${environment.baseUrl}/audits/${id}/auditors/${auditorId}`);
  }

  getStatistics(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/audits/statistics`);
  }
}