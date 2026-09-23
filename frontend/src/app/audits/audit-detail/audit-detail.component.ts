import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AuditService, Audit } from '../shared/services/audit.service';
import { AuditFindingService, AuditFinding } from '../shared/services/audit-finding.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-audit-detail',
  standalone: true,
  imports: [MatCardModule, MatButton, MatProgressSpinner, NgFor, NgIf],
  template: `
    <div *ngIf="loading" class="loading-container">
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    </div>
    <div *ngIf="!loading && audit" class="detail-container">
      <div class="detail-header">
        <button mat-button (click)="back()"><span class="material-icons">arrow_back</span>Back</button>
        <h2>{{ audit.title }}</h2>
        <button mat-raised-button color="primary" (click)="edit()">Edit</button>
      </div>
      <mat-card class="info-card">
        <mat-card-content>
          <div class="info-grid">
            <div class="info-item"><strong>Status:</strong> <span class="status-badge" [class]="audit.status">{{ audit.status | titlecase }}</span></div>
            <div class="info-item"><strong>Type:</strong> {{ audit.type | titlecase }}</div>
            <div class="info-item"><strong>Scope:</strong> {{ audit.scope | titlecase }}</div>
            <div class="info-item"><strong>Start Date:</strong> {{ audit.plannedStartDate | date }}</div>
            <div class="info-item"><strong>End Date:</strong> {{ audit.plannedEndDate | date }}</div>
            <div class="info-item"><strong>Total Findings:</strong> {{ audit.totalFindings }}</div>
          </div>
          <div *ngIf="audit.description" class="description">
            <strong>Description:</strong>
            <p>{{ audit.description }}</p>
          </div>
        </mat-card-content>
      </mat-card>
      <div class="section-title">Audit Findings ({{ findings.length }})</div>
      <div class="card-grid">
        <mat-card *ngFor="let finding of findings" class="finding-card" (click)="viewFinding(finding.id)">
          <mat-card-content>
            <div class="badges">
              <span class="severity-badge" [class]="finding.severity">{{ finding.severity | titlecase }}</span>
              <span class="status-badge" [class]="finding.status">{{ finding.status | titlecase }}</span>
            </div>
            <h4>{{ finding.title }}</h4>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .detail-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .detail-header h2 { flex: 1; margin: 0; color: #1a237e; }
    .info-card { margin-bottom: 24px; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; }
    .info-item { display: flex; gap: 8px; }
    .description { margin-top: 16px; }
    .section-title { font-size: 1.2rem; font-weight: 600; margin: 24px 0 16px; color: #333; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .finding-card { cursor: pointer; }
    .finding-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .badges { display: flex; gap: 8px; margin-bottom: 8px; }
    .loading-container { padding: 40px; text-align: center; }
  `]
})
export class AuditDetailComponent implements OnInit {
  audit: Audit | null = null;
  findings: AuditFinding[] = [];
  loading = true;
  auditId: number;

  constructor(
    private route:ActivatedRoute,
    private router: Router,
    private auditService: AuditService,
    private findingService: AuditFindingService
  ) {
    this.auditId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.loadAudit();
    this.loadFindings();
  }

  loadAudit() {
    this.auditService.getById(this.auditId).subscribe({
      next: (data) => { this.audit = data; }
    });
  }

  loadFindings() {
    this.findingService.getAll({ auditId: this.auditId }).subscribe({
      next: (data) => { this.findings = data.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  back() { this.router.navigate(['/audits']); }
  edit() { this.router.navigate(['/audits', this.auditId, 'edit']); }
  viewFinding(id: number) { this.router.navigate(['/audit-findings', id]); }
}