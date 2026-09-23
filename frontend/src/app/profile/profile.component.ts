import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../shared/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatCardModule, MatButton, MatProgressSpinner, NgIf],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
          </div>
          <div *ngIf="!loading && user" class="profile-content">
            <div class="profile-avatar">
              <span class="material-icons">account_circle</span>
            </div>
            <h2>{{ user.firstName }} {{ user.lastName }}</h2>
            <p class="user-role">{{ user.role | titlecase }}</p>
            <div class="profile-details">
              <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ user.email }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">{{ user.phone || 'Not provided' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Organization:</span>
                <span class="detail-value">{{ user.organization || 'Not provided' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Position:</span>
                <span class="detail-value">{{ user.position || 'Not provided' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span class="detail-value">{{ user.status | titlecase }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Member Since:</span>
                <span class="detail-value">{{ user.createdAt | date }}</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container { max-width: 600px; margin: 0 auto; }
    .profile-card { text-align: center; }
    .loading-container { padding: 40px; }
    .profile-avatar { margin-bottom: 16px; }
    .profile-avatar .material-icons { font-size: 80px; color: #1a237e; }
    .profile-card h2 { color: #1a237e; margin: 8px 0; }
    .user-role { color: #666; margin-bottom: 24px; }
    .profile-details { text-align: left; display: flex; flex-direction: column; gap: 12px; }
    .detail-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .detail-label { font-weight: 600; color: #555; }
    .detail-value { color: #333; }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  loading = true;
  private subscription: Subscription;

  constructor(private authService: AuthService) {
    this.subscription = this authService.currentUser$.subscribe(u => this.user = u);
  }

  ngOnInit() {
    this.loadUser();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadUser() {
    this.authService.me().subscribe({
      next: (data) => { this.user = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}