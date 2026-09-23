import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { InspectionService, Inspection } from '../shared/services/inspection.service';
import { FindingService, Finding } from '../shared/services/finding.service';
import { ReportService } from '../shared/services/report.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-inspection-detail',
  standalone: true,
  imports: [MatCardModule, MatButton, MatProgressSpinner, NgFor, NgIf],
  template: `
    <div *ngIf="loading" class="loading-container">
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    </div>

    <div *ngIf="!loading && inspection" class="detail-container">
      <div class="detail-header">
        <button mat-button (click)="back()"><span class="material-icons">arrow_back</span>Back</button>
        <h2>{{ inspection.title }}</h2>
        <button mat-raised-button color="primary" (click)="edit()">Edit</button>
      </div>

      <mat-card class="info-card">
        <mat-card-content>
          <div class="info-grid">
            <div class="info-item"><strong>Status:</strong> <span class="status-badge" [class]="inspection.status">{{ inspection.status | titlecase }}</span></div>
            <div class="info-item"><strong>Priority:</strong> <span class="priority-badge" [class]="inspection.priority">{{ inspection.priority | titlecase }}</span></div>
            <div class="info-item"><strong>Type:</strong> {{ inspection.type | titlecase }}</div>
            <div class="info-item"><strong>Scheduled Date:</strong> {{ inspection.scheduledDate | date }}</div>
            <div class="info-item"><strong>Location:</strong> {{ inspection.location || 'N/A' }}</div>
            <div class="info-item"><strong>Site:</strong> {{ inspection.siteName || 'N/A' }}</div>
            <div class="info-item"><strong>Total Findings:</strong> {{ inspection.totalFindings }}</div>
            <div class="info-item"><strong>Resolved:</strong> {{ inspection.resolvedFindings }}</div>
          </div>
          <div *ngIf="inspection.description" class="description">
            <strong>Description:</strong>
            <p>{{ inspection.description }}</p>
          </div>
          <div *ngIf="inspection.scope" class="scope">
            <strong>Scope:</strong> {{ inspection.scope }}
          </div>
        </mat-card-content>
      </mat-card>

      <div class="section-title">Findings ({{ findings.length }})</div>
      <div class="card-grid">
        <mat-card *ngFor="let finding of findings" class="finding-card" (click)="viewFinding(finding.id)">
          <mat-card-content>
            <div class="badges">
              <span class="severity-badge" [class]="finding.severity">{{ finding.severity | titlecase }}</span>
              <span class="status-badge" [class]="finding.status">{{ finding.status | titlecase }}</span>
            </div>
            <h4>{{ finding.title }}</h4>
            <p class="finding-desc">{{ finding.description | slice:0:80 }}...</p>
            <div class="finding-meta">
              <span>{{ finding.category | titlecase }}</span>
              <span *ngIf="finding.location">{{ finding.location }}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="actions">
        <button mat-raised-button color="accent" (click)="generateReport()">
          <span class="material-icons">description</span>Generate Report
        </button>
      </div>
    </div>
  `,
  styles: [`
    .detail-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .detail-header h2 { flex: 1; margin: 0; color: #1a237e; }
    .info-card { margin-bottom: 24px; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; }
    .info-item { display: flex; gap: 8px; }
    .description, .scope { margin-top: 16px; }
    .section-title { font-size: 1.2rem; font-weight: 600; margin: 24px 0 16px; color: #333; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .finding-card { cursor: pointer; transition: box-shadow 0.2s; }
    .finding-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .badges { display: flex; gap: 8px; margin-bottom: 8px; }
    .finding-desc { color: #666; font-size: 0.85rem; margin: 8px 0; }
    .finding-meta { display: flex; gap: 12px; font-size: 0.8rem; color: #888; }
    .actions { margin-top: 24px; }
    .loading-container { padding: 40px; text-align: center; }
  `]
})
export class InspectionDetailComponent implements OnInit {
  inspection: Inspection | null = null;
  findings: Finding[] = [];
  loading = true;
  inspectionId: number;

  constructor(
    private route:ActivatedRoute,
    private router: Router,
    private inspectionService: InspectionService,
    private findingService: FindingService,
    private reportService: ReportService
  ) {
    this.inspectionId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.loadInspection();
    this.loadFindings();
  }

  loadInspection() {
    this.inspectionService.getById(this.inspectionId).subscribe({
      next: (data) => { this.inspection = data; },
      error: () => { this.loading = false; }
    });
  }

  loadFindings() {
    this.findingService.getAll({ inspectionId: this.inspectionId }).subscribe({
      next: (data) => { this.findings = data.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  back() { this.router.navigate(['/inspections']); }
  edit() { this.router.navigate(['/inspections', this.inspectionId, 'edit']); }
  viewFinding(id: number) { this.router.navigate(['/findings', id]); }
  generateReport() {
    this.reportService.generate(this.inspectionId).subscribe({
      next: () => { this.router.navigate(['/reports']); },
      error: (err) => { alert(err.error?.error || 'Failed to generate report'); }
    });
  }
}