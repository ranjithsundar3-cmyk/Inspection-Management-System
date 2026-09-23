import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, Validators } from '@angular/forms';
import { ReactiveModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule, MatButton, MatFormField, MatLabel, MatInput,
    ReactiveModule, MatProgressSpinner, NgIf
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Inspection & Audit Management System</mat-card-title>
          <mat-card-subtitle>Sign in to your account</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" [formControl]="emailControl" placeholder="Enter your email">
              <mat-error *ngIf="emailControl.invalid && emailControl.touched">
                Please enter a valid email
              </mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" [formControl]="passwordControl" placeholder="Enter your password">
              <mat-error *ngIf="passwordControl.invalid && passwordControl.touched">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>
            <div *ngIf="error" class="error-message">{{ error }}</div>
            <button mat-raised-button color="primary" type="submit" class="full-width login-btn" [disabled]="loading">
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .login-card { width: 400px; max-width: 90vw; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .login-btn { margin-top: 8px; height: 48px; }
    .error-message { color: #f44336; margin: 8px 0; text-align: center; }
    mat-card-header { display: flex; flex-direction: column; align-items: center; }
    mat-card-title { margin-bottom: 8px; }
  `]
})
export class LoginComponent {
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.emailControl.invalid || this.passwordControl.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this authService.login({
      email: this.emailControl.value!,
      password: this.passwordControl.value!
    }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}