import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuditService, Audit } from '../shared/services/audit.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import { PageResponse } from '../shared/models/pagination';

@Component({
  selector: 'app-audit-list',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, MatButton, MatProgressSpinner, NgFor, NgIf],
  template: `
    <div class="page-header">
      <h2>Audits</h2>
      <button mat-raised-button color="primary" (click)="navigate('/audits/new')">
        <span class="material-icons">add</span>New Audit
      </button>
    </div>
    <div *ngIf="loading" class="loading-container">
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    </div>
    <div *ngIf="!loading" class="card-grid">
      <mat-card *ngFor="let item of audits" class="item-card" (click)="navigate('/audits/' + item.id)">
        <mat-card-content>
          <div class="badges">
            <span class="status-badge" [class]="item.status">{{ item.status | titlecase }}</span>
            <span class="type-badge">{{ item.type | titlecase }}</span>
          </div>
          <h4>{{ item.title }}</h4>
          <p class="description">{{ item.description | slice:0:80 }}...</p>
          <div class="meta-info">
            <span><span class="material-icons">calendar_today</span> {{ item.plannedStartDate | date }} - {{ item.plannedEndDate | date }}</span>
            <span><span class="material-icons">warning</span> {{ item.totalFindings }} findings</span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
    <div *ngIf="!loading && audits.length === 0" class="empty-state">
      <span class="material-icons empty-icon">rate_review</span>
      <p>No audits found</p>
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
export class AuditListComponent implements OnInit {
  audits: Audit[] = [];
  loading = true;

  constructor(private auditService: AuditService, private router: Router) {}

  ngOnInit() { this.loadAudits(); }

  loadAudits() {
    this.auditService.getAll().subscribe({
      next: (data: PageResponse<Audit>) => { this.audits = data.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  navigate(path: string) { this.router.navigate([path]); }
}