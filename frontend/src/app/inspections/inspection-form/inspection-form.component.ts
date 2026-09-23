import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { InspectionService, Inspection } from '../shared/services/inspection.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-inspection-form',
  standalone: true,
  imports: [MatCardModule, MatButton, MatProgressSpinner, NgIf],
  template: `
    <div class="form-container">
      <h2>{{ isEdit ? 'Edit Inspection' : 'Create Inspection' }}</h2>
      <mat-card>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" class="app-form">
            <div class="form-group">
              <label>Title</label>
              <input type="text" [(ngModel)]="inspection.title" name="title" required placeholder="Inspection title">
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="inspection.description" name="description" rows="3" placeholder="Description"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Type</label>
                <select [(ngModel)]="inspection.type" name="type">
                  <option value="routine">Routine</option>
                  <option value="compliance">Compliance</option>
                  <option value="spot">Spot</option>
                  <option value="follow_up">Follow Up</option>
                </select>
              </div>
              <div class="form-group">
                <label>Priority</label>
                <select [(ngModel)]="inspection.priority" name="priority">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Scheduled Date</label>
                <input type="date" [(ngModel)]="inspection.scheduledDate" name="scheduledDate" required>
              </div>
              <div class="form-group">
                <label>Location</label>
                <input type="text" [(ngModel)]="inspection.location" name="location" placeholder="Location">
              </div>
            </div>
            <div class="form-group">
              <label>Site Name</label>
              <input type="text" [(ngModel)]="inspection.siteName" name="siteName" placeholder="Site name">
            </div>
            <div class="form-group">
              <label>Scope</label>
              <textarea [(ngModel)]="inspection.scope" name="scope" rows="2" placeholder="Scope of inspection"></textarea>
            </div>
            <div class="form-group">
              <label>Objectives</label>
              <textarea [(ngModel)]="inspection.objectives" name="objectives" rows="2" placeholder="Objectives"></textarea>
            </div>
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="saving">
                {{ saving ? 'Saving...' : 'Save' }}
              </button>
              <button mat-button type="button" (click)="cancel()">Cancel</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { max-width: 800px; margin: 0 auto; }
    .form-container h2 { color: #1a237e; margin-bottom: 24px; }
    .app-form { display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: flex; gap: 16px; }
    .form-group { display: flex; flex-direction: column; flex: 1; }
    .form-group label { font-weight: 600; margin-bottom: 4px; font-size: 0.9rem; }
    .form-group input, .form-group select, .form-group textarea {
      padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;
    }
    .form-actions { display: flex; gap: 12px; margin-top: 16px; }
  `]
})
export class InspectionFormComponent implements OnInit {
  inspection: Inspection = {
    id: 0, title: '', description: '', type: 'routine', status: 'scheduled',
    priority: 'medium', scheduledDate: new Date().toISOString().split('T')[0],
    location: '', siteName: '', scope: '', objectives: '',
    totalFindings: 0, criticalFindings: 0, highFindings: 0, mediumFindings: 0,
    lowFindings: 0, resolvedFindings: 0, reportGenerated: false, reportId: 0,
    assignedInspectorId: 0, createdById: 0, createdAt: new Date(), updatedAt: new Date()
  };
  isEdit = false;
  saving = false;
  inspectionId: number | null = null;

  constructor(
    private route:ActivatedRoute,
    private router: Router,
    private inspectionService: InspectionService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.inspectionId = Number(id);
      this.loadInspection(this.inspectionId);
    }
  }

  loadInspection(id: number) {
    this.inspectionService.getById(id).subscribe({
      next: (data) => {
        this.inspection = { ...data, scheduledDate: new Date(data.scheduledDate).toISOString().split('T')[0] };
      }
    });
  }

  onSubmit() {
    if (!this.inspection.title) { alert('Title is required'); return; }
    this.saving = true;

    const save$ = this.isEdit && this.inspectionId
      ? this.inspectionService.update(this.inspectionId, this.inspection)
      : this.inspectionService.create(this.inspection);

    save$.subscribe({
      next: () => { this.router.navigate(['/inspections']); },
      error: (err) => { alert(err.error?.error || 'Failed to save'); this.saving = false; }
    });
  }

  cancel() { this.router.navigate(['/inspections']); }
}