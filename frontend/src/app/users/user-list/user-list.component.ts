import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../shared/services/user.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import { PageResponse } from '../shared/models/pagination';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [MatGridListModule, MatCardModule, MatButton, MatProgressSpinner, NgFor, NgIf],
  template: `
    <div class="page-header">
      <h2>Users</h2>
      <button mat-raised-button color="primary" (click)="navigate('/users/new')">
        <span class="material-icons">add</span>New User
      </button>
    </div>
    <div *ngIf="loading" class="loading-container">
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    </div>
    <div *ngIf="!loading" class="card-grid">
      <mat-card *ngFor="let item of users" class="item-card">
        <mat-card-content>
          <div class="user-avatar">
            <span class="material-icons">account_circle</span>
          </div>
          <h4>{{ item.firstName }} {{ item.lastName }}</h4>
          <p class="user-email">{{ item.email }}</p>
          <div class="badges">
            <span class="role-badge">{{ item.role | titlecase }}</span>
            <span class="status-badge" [class]="item.status">{{ item.status | titlecase }}</span>
          </div>
          <div class="user-info">
            <span>{{ item.organization || 'No organization' }}</span>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button color="primary" (click)="editUser(item.id)">Edit</button>
          <button mat-button color="warn" (click)="deleteUser(item.id)">Delete</button>
        </mat-card-actions>
      </mat-card>
    </div>
    <div *ngIf="!loading && users.length === 0" class="empty-state">
      <span class="material-icons empty-icon">people</span>
      <p>No users found</p>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h2 { color: #1a237e; margin: 0; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .item-card { transition: box-shadow 0.2s; }
    .item-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .user-avatar { display: flex; justify-content: center; margin-bottom: 12px; }
    .user-avatar .material-icons { font-size: 48px; color: #1a237e; }
    .user-email { color: #666; font-size: 0.85rem; margin: 4px 0; }
    .badges { display: flex; gap: 8px; margin: 8px 0; }
    .user-info { font-size: 0.8rem; color: #888; }
    .loading-container { padding: 40px; text-align: center; }
    .empty-state { text-align: center; padding: 60px 20px; color: #888; }
    .empty-icon { font-size: 64px; }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = true;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (data: PageResponse<User>) => { this.users = data.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  navigate(path: string) { this.router.navigate([path]); }
  editUser(id: number) { this.router.navigate(['/users', id, 'edit']); }
  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.delete(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => alert(err.error?.error || 'Failed to delete user')
      });
    }
  }
}