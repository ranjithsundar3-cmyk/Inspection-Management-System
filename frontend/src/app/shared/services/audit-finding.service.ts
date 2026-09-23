import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/pagination';

export interface AuditFinding {
  id: number;
  title: string;
  description: string;
  observation: string;
  evidence: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'false_positive';
  category: 'compliance' | 'process' | 'control_gap' | 'data_integrity' | 'risk';
  location: string;
  dueDate: Date;
  resolvedDate: Date;
  correctiveAction: string;
  preventiveAction: string;
  recommendation: string;
  rootCause: string;
  verified: boolean;
  verifiedById: number;
  assignedToId: number;
  auditId: number;
  reportedById: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuditFindingService {
  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<PageResponse<AuditFinding>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, String(params[key]));
        }
      });
    }
    return this.http.get<PageResponse<AuditFinding>>(`${environment.baseUrl}/audit-findings`, { params: httpParams });
  }

  getById(id: number): Observable<AuditFinding> {
    return this.http.get<AuditFinding>(`${environment.baseUrl}/audit-findings/${id}`);
  }

  create(data: any): Observable<AuditFinding> {
    return this.http.post<AuditFinding>(`${environment.baseUrl}/audit-findings`, data);
  }

  update(id: number, data: any): Observable<AuditFinding> {
    return this.http.put<AuditFinding>(`${environment.baseUrl}/audit-findings/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/audit-findings/${id}`);
  }

  getStatistics(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/audit-findings/statistics`);
  }
}