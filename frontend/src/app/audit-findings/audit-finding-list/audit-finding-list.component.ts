import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuditFindingService, AuditFinding } from '../shared/services/audit-finding.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import { PageResponse } from '../shared/models/pagination';

@Component({
  selector: 'app-audit-finding-list',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, MatButton, MatProgressSpinner, NgFor, NgIf],
  template: `
    <div class="page-header">
      <h2>Audit Findings</h2>
      <button mat-raised-button color="primary" (click)="navigate('/audit-findings/new')">
        <span class="material-icons">add</span>New Audit Finding
      </button>
    </div>
    <div *ngIf="loading" class="loading-container">
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    </div>
    <div *ngIf="!loading" class="card-grid">
      <mat-card *ngFor="let item of findings" class="item-card" (click)="navigate('/audit-findings/' + item.id)">
        <mat-card-content>
          <div class="badges">
            <span class="severity-badge" [class]="item.severity">{{ item.severity | titlecase }}</span>
            <span class="status-badge" [class]="item.status">{{ item.status | titlecase }}</span>
          </div>
          <h4>{{ item.title }}</h4>
          <p class="description">{{ item.description | slice:0:80 }}...</p>
          <div class="meta-info">
            <span>{{ item.category | titlecase }}</span>
            <span *ngIf="item.location">{{ item.location }}</span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
    <div *ngIf="!loading && findings.length === 0" class="empty-state">
      <span class="material-icons empty-icon">search</span>
      <p>No audit findings found</p>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
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
export class AuditFindingListComponent implements OnInit {
  findings: AuditFinding[] = [];
  loading = true;

  constructor(private findingService: AuditFindingService, private router: Router) {}

  ngOnInit() { this.loadFindings(); }

  loadFindings() {
    this.findingService.getAll().subscribe({
      next: (data: PageResponse<AuditFinding>) => { this.findings = data.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  navigate(path: string) { this.router.navigate([path]); }
}