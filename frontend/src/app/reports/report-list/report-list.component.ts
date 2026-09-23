import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService, Report } from '../shared/services/report.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import { PageResponse } from '../shared/models/pagination';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, MatButton, MatProgressSpinner, NgFor, NgIf],
  template: `
    <div class="page-header">
      <h2>Reports</h2>
    </div>
    <div *ngIf="loading" class="loading-container">
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    </div>
    <div *ngIf="!loading" class="card-grid">
      <mat-card *ngFor="let item of reports" class="item-card" (click)="navigate('/reports/' + item.id)">
        <mat-card-content>
          <div class="badges">
            <span class="status-badge" [class]="item.status">{{ item.status | titlecase }}</span>
            <span class="type-badge">{{ item.format | uppercase }}</span>
          </div>
          <h4>{{ item.title }}</h4>
          <p class="description">{{ item.summary | slice:0:80 }}...</p>
          <div class="meta-info">
            <span><span class="material-icons">calendar_today</span> {{ item.generatedDate | date }}</span>
            <span><span class="material-icons">warning</span> {{ item.totalFindings }} findings</span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
    <div *ngIf="!loading && reports.length === 0" class="empty-state">
      <span class="material-icons empty-icon">description</span>
      <p>No reports found</p>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-header h2 { color: #1a237e; margin: 0; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .item-card { cursor: pointer; transition: box-shadow 0.2s; }
    .item-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .badges { display: flex; gap: 8px; margin-bottom: 8px; }
    .description { color: #666; font-size: 0.85rem; margin: 8px 0; }
    .meta-info { display: flex; gap: 12px; font-size: 0.8rem; color: #888; }
    .loading-container { padding: 40px; text-align: center; }
    .empty-state { text-align: center; padding: 60px 20px; color: #888; }
    .empty-icon { font-size: 64px; }
  `]
})
export class ReportListComponent implements OnInit {
  reports: Report[] = [];
  loading = true;

  constructor(private reportService: ReportService, private router: Router) {}

  ngOnInit() { this.loadReports(); }

  loadReports() {
    this.reportService.getAll().subscribe({
      next: (data: PageResponse<Report>) => { this.reports = data.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  navigate(path: string) { this.router.navigate([path]); }
}