import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/pagination';

export interface Inspection {
  id: number;
  title: string;
  description: string;
  type: 'routine' | 'compliance' | 'spot' | 'follow_up';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  scheduledDate: Date;
  completedDate: Date;
  location: string;
  siteName: string;
  scope: string;
  objectives: string;
  totalFindings: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  resolvedFindings: number;
  reportGenerated: boolean;
  reportId: number;
  assignedInspectorId: number;
  createdById: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInspectionRequest {
  title: string;
  description?: string;
  type?: string;
  priority?: string;
  scheduledDate: Date;
  location?: string;
  siteName?: string;
  scope?: string;
  objectives?: string;
  assignedInspectorId?: number;
}

export interface UpdateInspectionRequest {
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  priority?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  location?: string;
  siteName?: string;
  scope?: string;
  objectives?: string;
  assignedInspectorId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<PageResponse<Inspection>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, String(params[key]));
        }
      });
    }
    return this.http.get<PageResponse<Inspection>>(`${environment.baseUrl}/inspections`, { params: httpParams });
  }

  getById(id: number): Observable<Inspection> {
    return this.http.get<Inspection>(`${environment.baseUrl}/inspections/${id}`);
  }

  create(data: CreateInspectionRequest): Observable<Inspection> {
    return this.http.post<Inspection>(`${environment.baseUrl}/inspections`, data);
  }

  update(id: number, data: UpdateInspectionRequest): Observable<Inspection> {
    return this.http.put<Inspection>(`${environment.baseUrl}/inspections/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/inspections/${id}`);
  }

  getStatistics(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/inspections/statistics`);
  }
}