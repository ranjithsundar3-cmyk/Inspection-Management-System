import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AuditService, Audit } from '../shared/services/audit.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-audit-form',
  standalone: true,
  imports: [MatCardModule, MatButton, NgIf],
  template: `
    <div class="form-container">
      <h2>Create Audit</h2>
      <mat-card>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" class="app-form">
            <div class="form-group">
              <label>Title</label>
              <input type="text" [(ngModel)]="audit.title" name="title" required placeholder="Audit title">
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="audit.description" name="description" rows="3" placeholder="Description"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Type</label>
                <select [(ngModel)]="audit.type" name="type">
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                  <option value="certification">Certification</option>
                  <option value="regulatory">Regulatory</option>
                </select>
              </div>
              <div class="form-group">
                <label>Scope</label>
                <select [(ngModel)]="audit.scope" name="scope">
                  <option value="quality">Quality</option>
                  <option value="safety">Safety</option>
                  <option value="environmental">Environmental</option>
                  <option value="financial">Financial</option>
                  <option value="information_security">Information Security</option>
                  <option value="operational">Operational</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Start Date</label>
                <input type="date" [(ngModel)]="audit.plannedStartDate" name="plannedStartDate" required>
              </div>
              <div class="form-group">
                <label>End Date</label>
                <input type="date" [(ngModel)]="audit.plannedEndDate" name="plannedEndDate" required>
              </div>
            </div>
            <div class="form-group">
              <label>Site Name</label>
              <input type="text" [(ngModel)]="audit.siteName" name="siteName" placeholder="Site name">
            </div>
            <div class="form-group">
              <label>Location</label>
              <input type="text" [(ngModel)]="audit.location" name="location" placeholder="Location">
            </div>
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="saving">
                {{ saving ? 'Saving...' : 'Create' }}
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
export class AuditFormComponent implements OnInit {
  audit: Audit = {
    id: 0, title: '', description: '', type: 'internal', status: 'planning',
    plannedStartDate: new Date().toISOString().split('T')[0],
    plannedEndDate: new Date().toISOString().split('T')[0],
    actualStartDate: null, actualEndDate: null, scope: 'operational',
    criteria: '', standards: '', siteName: '', location: '',
    totalFindings: 0, criticalFindings: 0, highFindings: 0, mediumFindings: 0,
    lowFindings: 0, resolvedFindings: 0, reportGenerated: false, reportId: 0,
    leadAuditorId: 0, createdById: 0, auditors: [], createdAt: new Date(), updatedAt: new Date()
  };
  saving = false;

  constructor(private router: Router, private auditService: AuditService) {}

  ngOnInit() {}

  onSubmit() {
    if (!this.audit.title) { alert('Title is required'); return; }
    this.saving = true;
    this.auditService.create(this.audit).subscribe({
      next: () => { this.router.navigate(['/audits']); },
      error: (err) => { alert(err.error?.error || 'Failed to create audit'); this.saving = false; }
    });
  }

  cancel() { this.router.navigate(['/audits']); }
}