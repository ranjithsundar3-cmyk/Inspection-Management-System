import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FindingService, Finding } from '../shared/services/finding.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-finding-detail',
  standalone: true,
  imports: [MatCardModule, MatButton, NgIf],
  template: `
    <div class="detail-container">
      <button mat-button (click)="back()"><span class="material-icons">arrow_back</span>Back</button>
      <mat-card *ngIf="finding">
        <mat-card-content>
          <h2>{{ finding.title }}</h2>
          <div class="badges">
            <span class="severity-badge" [class]="finding.severity">{{ finding.severity | titlecase }}</span>
            <span class="status-badge" [class]="finding.status">{{ finding.status | titlecase }}</span>
          </div>
          <p class="description">{{ finding.description }}</p>
          <div class="meta-info">
            <span>Category: {{ finding.category | titlecase }}</span>
            <span *ngIf="finding.location">Location: {{ finding.location }}</span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .detail-container { max-width: 800px; margin: 0 auto; }
    .badges { display: flex; gap: 8px; margin: 12px 0; }
    .description { color: #333; line-height: 1.6; margin: 16px 0; }
    .meta-info { display: flex; gap: 16px; font-size: 0.9rem; color: #666; }
  `]
})
export class FindingDetailComponent {
  finding: Finding | null = null;

  constructor(private router: Router, private findingService: FindingService) {}

  ngOnInit() {}

  back() { this.router.navigate(['/findings']); }
}