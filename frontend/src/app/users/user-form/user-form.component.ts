import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../shared/services/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [MatCardModule, MatButton, NgIf],
  template: `
    <div class="form-container">
      <h2>Create User</h2>
      <mat-card>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" class="app-form">
            <div class="form-row">
              <div class="form-group">
                <label>First Name</label>
                <input type="text" [(ngModel)]="user.firstName" name="firstName" required placeholder="First name">
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input type="text" [(ngModel)]="user.lastName" name="lastName" required placeholder="Last name">
              </div>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="user.email" name="email" required placeholder="Email">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" [(ngModel)]="user.password" name="password" required placeholder="Password (min 6 chars)">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Role</label>
                <select [(ngModel)]="user.role" name="role">
                  <option value="viewer">Viewer</option>
                  <option value="inspector">Inspector</option>
                  <option value="auditor">Auditor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="form-group">
                <label>Organization</label>
                <input type="text" [(ngModel)]="user.organization" name="organization" placeholder="Organization">
              </div>
            </div>
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="saving">
                {{ saving ? 'Saving...' : 'Create User' }}
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
    .form-group input, .form-group select {
      padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem;
    }
    .form-actions { display: flex; gap: 12px; margin-top: 16px; }
  `]
})
export class UserFormComponent {
  user: User = {
    id: 0, email: '', firstName: '', lastName: '', password: '',
    phone: '', organization: '', position: '', role: 'inspector',
    status: 'active', createdAt: new Date(), updatedAt: new Date()
  };
  saving = false;

  constructor(private router: Router, private userService: UserService) {}

  onSubmit() {
    if (!this.user.email || !this.user.password || !this.user.firstName) {
      alert('Email, Password, and First Name are required'); return;
    }
    this.saving = true;
    this.userService.create(this.user).subscribe({
      next: () => { this.router.navigate(['/users']); },
      error: (err) => { alert(err.error?.error || 'Failed to create user'); this.saving = false; }
    });
  }

  cancel() { this.router.navigate(['/users']); }
}