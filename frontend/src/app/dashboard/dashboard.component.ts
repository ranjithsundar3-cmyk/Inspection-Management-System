import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardStats } from '../shared/models/dashboard';
import { InspectionService } from '../shared/services/inspection.service';
import { FindingService } from '../shared/services/finding.service';
import { AuditService } from '../shared/services/audit.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatGridListModule, MatCardModule, MatButton, MatProgressSpinner, NgFor, NgIf
  ],
  template: `
    <div class="dashboard-container">
      <h2 class="page-title">Dashboard</h2>

      <div *ngIf="loading" class="loading-container">
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </div>

      <div *ngIf="!loading" class="stats-grid">
        <div class="stat-card" *ngFor="let stat of statCards">
          <mat-card>
            <mat-card-content>
              <div class="stat-icon" [class]="stat.iconClass">
                <span class="material-icons">{{ stat.icon }}</span>
              </div>
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div class="section-title">Quick Actions</div>
      <div class="quick-actions">
        <button mat-raised-button color="primary" (click)="navigate('/inspections/new')">
          <span class="material-icons">add</span>New Inspection
        </button>
        <button mat-raised-button color="accent" (click)="navigate('/findings/new')">
          <span class="material-icons">warning</span>New Finding
        </button>
        <button mat-raised-button (click)="navigate('/audits/new')">
          <span class="material-icons">rate_review</span>New Audit
        </button>
        <button mat-raised-button (click)="navigate('/reports')">
          <span class="material-icons">description</span>Reports
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { max-width: 1400px; margin: 0 auto; }
    .page-title { color: #1a237e; margin-bottom: 24px; font-weight: 600; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .stat-card { cursor: pointer; transition: transform 0.2s; }
    .stat-card:hover { transform: translateY(-4px); }
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }
    .stat-icon .material-icons { font-size: 28px; color: white; }
    .stat-value { font-size: 2.5rem; font-weight: 700; color: #1a237e; }
    .stat-label { color: #666; font-size: 0.9rem; }
    .section-title { font-size: 1.2rem; font-weight: 600; margin: 32px 0 16px; color: #333; }
    .quick-actions { display: flex; gap: 12px; flex-wrap: wrap; }
    .quick-actions button { height: 48px; }
    .loading-container { display: flex; justify-content: center; padding: 40px; }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  loading = true;
  statCards: any[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private inspectionService: InspectionService,
    private findingService: FindingService,
    private auditService: AuditService
  ) {}

  ngOnInit() {
    this.loadStatistics();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  loadStatistics() {
    const sub1 = this.inspectionService.getStatistics().subscribe(stats => {
      this.statCards = [
        { label: 'Total Inspections', value: stats.total, icon: 'assignment', iconClass: 'bg-blue' },
        { label: 'Scheduled', value: stats.scheduled, icon: 'schedule', iconClass: 'bg-blue' },
        { label: 'In Progress', value: stats.inProgress, icon: 'autorenew', iconClass: 'bg-orange' },
        { label: 'Completed', value: stats.completed, icon: 'check_circle', iconClass: 'bg-green' },
        { label: 'Cancelled', value: stats.cancelled, icon: 'cancel', iconClass: 'bg-red' },
      ];
    });
    this.subscriptions.push(sub1);
    this.loading = false;
  }

  navigate(path: string) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}