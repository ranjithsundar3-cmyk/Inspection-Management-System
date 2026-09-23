import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { AuditFindingService, AuditFinding } from '../shared/services/audit-finding.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-audit-finding-form',
  standalone: true,
  imports: [MatCardModule, MatButton, NgIf],
  template: `
    <div class="form-container">
      <h2>Create Audit Finding</h2>
      <mat-card>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" class="app-form">
            <div class="form-group">
              <label>Title</label>
              <input type="text" [(ngModel)]="finding.title" name="title" required placeholder="Finding title">
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="finding.description" name="description" rows="3" required placeholder="Description"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Severity</label>
                <select [(ngModel)]="finding.severity" name="severity" required>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="info">Info</option>
                </select>
              </div>
              <div class="form-group">
                <label>Category</label>
                <select [(ngModel)]="finding.category" name="category" required>
                  <option value="compliance">Compliance</option>
                  <option value="process">Process</option>
                  <option value="control_gap">Control Gap</option>
                  <option value="data_integrity">Data Integrity</option>
                  <option value="risk">Risk</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Audit ID</label>
                <input type="number" [(ngModel)]="finding.auditId" name="auditId" required>
              </div>
              <div class="form-group">
                <label>Location</label>
                <input type="text" [(ngModel)]="finding.location" name="location" placeholder="Location">
              </div>
            </div>
            <div class="form-group">
              <label>Observation</label>
              <textarea [(ngModel)]="finding.observation" name="observation" rows="2" placeholder="Observation"></textarea>
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
export class AuditFindingFormComponent implements OnInit {
  finding: AuditFinding = {
    id: 0, title: '', description: '', observation: '', evidence: '',
    severity: 'medium', status: 'open', category: 'compliance',
    location: '', dueDate: null, resolvedDate: null, correctiveAction: '',
    preventiveAction: '', recommendation: '', rootCause: '', verified: false,
    verifiedById: 0, assignedToId: 0, auditId: 0, reportedById: 0,
    createdAt: new Date(), updatedAt: new Date()
  };
  saving = false;

  constructor(private router: Router, private findingService: AuditFindingService) {}

  ngOnInit() {}

  onSubmit() {
    if (!this.finding.title || !this.finding.auditId) { alert('Title and Audit ID are required'); return; }
    this.saving = true;
    this.findingService.create(this.finding).subscribe({
      next: () => { this.router.navigate(['/audit-findings']); },
      error: (err) => { alert(err.error?.error || 'Failed to create audit finding'); this.saving = false; }
    });
  }

  cancel() { this.router.navigate(['/audit-findings']); }
}