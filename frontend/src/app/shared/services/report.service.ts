import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/pagination';

export interface Report {
  id: number;
  title: string;
  summary: string;
  format: 'pdf' | 'html' | 'excel' | 'word';
  status: 'draft' | 'generated' | 'published' | 'archived';
  generatedDate: Date;
  publishedDate: Date;
  filePath: string;
  data: any;
  totalFindings: number;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  resolvedFindings: number;
  openFindings: number;
  inspectionId: number;
  generatedById: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) {}

  generate(inspectionId: number, format: string = 'pdf'): Observable<Report> {
    return this.http.post<Report>(`${environment.baseUrl}/reports/generate`, { inspectionId, format });
  }

  getAll(params?: any): Observable<PageResponse<Report>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, String(params[key]));
        }
      });
    }
    return this.http.get<PageResponse<Report>>(`${environment.baseUrl}/reports`, { params: httpParams });
  }

  getById(id: number): Observable<Report> {
    return this.http.get<Report>(`${environment.baseUrl}/reports/${id}`);
  }

  updateStatus(id: number, status: string): Observable<Report> {
    return this.http.put<Report>(`${environment.baseUrl}/reports/${id}`, { status });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/reports/${id}`);
  }
}