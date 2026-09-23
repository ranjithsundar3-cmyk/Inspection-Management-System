import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InspectionService, Inspection } from '../shared/services/inspection.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import { PageResponse } from '../shared/models/pagination';

@Component({
  selector: 'app-inspection-list',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, MatButton, MatProgressSpinner, NgFor, NgIf],
  template: `
    <div class="page-header">
      <h2>Inspections</h2>
      <button mat-raised-button color="primary" (click)="navigate('/inspections/new')">
        <span class="material-icons">add</span>New Inspection
      </button>
    </div>

    <div *ngIf="loading" class="loading-container">
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    </div>

    <div *ngIf="!loading" class="card-grid">
      <mat-card *ngFor="let item of inspections" class="item-card" (click)="navigate('/inspections/' + item.id)">
        <mat-card-header>
          <mat-card-title>{{ item.title }}</mat-card-title>
          <mat-card-subtitle>{{ item.siteName || 'No location' }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="badges">
            <span class="status-badge" [class]="item.status">{{ item.status | titlecase }}</span>
            <span class="priority-badge" [class]="item.priority">{{ item.priority | titlecase }}</span>
            <span class="type-badge">{{ item.type | titlecase }}</span>
          </div>
          <p class="description">{{ item.description | slice:0:100 }}{{ item.description && item.description.length > 100 ? '...' : '' }}</p>
          <div class="meta-info">
            <span><span class="material-icons">schedule</span> {{ item.scheduledDate | date }}</span>
            <span><span class="material-icons">warning</span> {{ item.totalFindings }} findings</span>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button color="primary" (click)="navigate('/inspections/' + item.id)">View</button>
          <button mat-button (click)="navigate('/inspections/' + item.id + '/edit')">Edit</button>
        </mat-card-actions>
      </mat-card>
    </div>

    <div *ngIf="!loading && inspections.length === 0" class="empty-state">
      <span class="material-icons empty-icon">assignment</span>
      <p>No inspections found</p>
      <button mat-raised-button color="primary" (click)="navigate('/inspections/new')">Create First Inspection</button>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { color: #1a237e; margin: 0; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 16px; }
    .item-card { cursor: pointer; transition: box-shadow 0.2s; }
    .item-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .badges { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
    .description { color: #666; font-size: 0.9rem; margin-bottom: 12px; }
    .meta-info { display: flex; gap: 16px; font-size: 0.85rem; color: #888; }
    .meta-info span { display: flex; align-items: center; gap: 4px; }
    .loading-container { padding: 40px; text-align: center; }
    .empty-state { text-align: center; padding: 60px 20px; color: #888; }
    .empty-icon { font-size: 64px; }
  `]
})
export class InspectionListComponent implements OnInit {
  inspections: Inspection[] = [];
  loading = true;

  constructor(private inspectionService: InspectionService, private router: Router) {}

  ngOnInit() {
    this.loadInspections();
  }

  loadInspections() {
    this.inspectionService.getAll().subscribe({
      next: (data: PageResponse<Inspection>) => {
        this.inspections = data.data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}