import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/pagination';

export interface Finding {
  id: number;
  title: string;
  description: string;
  observation: string;
  evidence: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'false_positive';
  category: 'safety' | 'compliance' | 'quality' | 'security' | 'environmental' | 'operational';
  location: string;
  dueDate: Date;
  resolvedDate: Date;
  correctiveAction: string;
  preventiveAction: string;
  rootCause: string;
  verified: boolean;
  verifiedById: number;
  assignedToId: number;
  inspectionId: number;
  reportedById: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFindingRequest {
  title: string;
  description: string;
  observation?: string;
  evidence?: string;
  severity: string;
  category: string;
  location?: string;
  dueDate?: Date;
  assignedToId?: number;
  inspectionId: number;
}

export interface UpdateFindingRequest {
  title?: string;
  description?: string;
  observation?: string;
  evidence?: string;
  severity?: string;
  status?: string;
  category?: string;
  location?: string;
  dueDate?: Date;
  resolvedDate?: Date;
  correctiveAction?: string;
  preventiveAction?: string;
  rootCause?: string;
  assignedToId?: number;
  verified?: boolean;
  verifiedById?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FindingService {
  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<PageResponse<Finding>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, String(params[key]));
        }
      });
    }
    return this.http.get<PageResponse<Finding>>(`${environment.baseUrl}/findings`, { params: httpParams });
  }

  getById(id: number): Observable<Finding> {
    return this.http.get<Finding>(`${environment.baseUrl}/findings/${id}`);
  }

  create(data: CreateFindingRequest): Observable<Finding> {
    return this.http.post<Finding>(`${environment.baseUrl}/findings`, data);
  }

  update(id: number, data: UpdateFindingRequest): Observable<Finding> {
    return this.http.put<Finding>(`${environment.baseUrl}/findings/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/findings/${id}`);
  }

  getStatistics(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/findings/statistics`);
  }
}