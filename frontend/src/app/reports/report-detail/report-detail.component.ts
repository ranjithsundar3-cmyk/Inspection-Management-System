import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService, Report } from '../shared/services/report.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [MatCardModule, MatButton, NgIf],
  template: `
    <div class="detail-container">
      <button mat-button (click)="back()"><span class="material-icons">arrow_back</span>Back</button>
      <mat-card *ngIf="report">
        <mat-card-content>
          <h2>{{ report.title }}</h2>
          <div class="badges">
            <span class="status-badge" [class]="report.status">{{ report.status | titlecase }}</span>
            <span class="type-badge">{{ report.format | uppercase }}</span>
          </div>
          <p class="summary">{{ report.summary }}</p>
          <div class="report-stats">
            <div class="stat-item"><strong>Total:</strong> {{ report.totalFindings }}</div>
            <div class="stat-item"><strong>Critical:</strong> {{ report.criticalFindings }}</div>
            <div class="stat-item"><strong>High:</strong> {{ report.highFindings }}</div>
            <div class="stat-item"><strong>Medium:</strong> {{ report.mediumFindings }}</div>
            <div class="stat-item"><strong>Low:</strong> {{ report.lowFindings }}</div>
            <div class="stat-item"><strong>Resolved:</strong> {{ report.resolvedFindings }}</div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .detail-container { max-width: 900px; margin: 0 auto; }
    .badges { display: flex; gap: 8px; margin: 12px 0; }
    .summary { color: #333; line-height: 1.6; margin: 16px 0; }
    .report-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-top: 16px; }
    .stat-item { padding: 8px; background: #f5f5f5; border-radius: 4px; }
  `]
})
export class ReportDetailComponent {
  report: Report | null = null;

  constructor(private router: Router, private reportService: ReportService) {}

  back() { this.router.navigate(['/reports']); }
}