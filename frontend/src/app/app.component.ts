import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButton, MatAnchor } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'Inspections', icon: 'assignment', route: '/inspections' },
  { label: 'Findings', icon: 'warning', route: '/findings' },
  { label: 'Reports', icon: 'description', route: '/reports' },
  { label: 'Audits', icon: 'rate_review', route: '/audits' },
  { label: 'Audit Findings', icon: 'search', route: '/audit-findings', roles: ['auditor', 'admin'] },
  { label: 'Users', icon: 'people', route: '/users', roles: ['admin'] },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive, AsyncPipe, NgIf, NgFor,
    MatToolbarModule, MatSidenavModule, MatListModule,
    MatButton, MatAnchor, MatMenuModule, MatIcon, MatDividerModule
  ],
  template: `
    <mat-s-container class="app-container">
      <mat-s [(opened)]="sOpened" [mode]="isHandset$ | async ? 'over' : 'side'" [fixedTopGap]="0">
        <mat-toolbar class="snav-toolbar">
          <button mat-icon-button (click)="toggleS()" *ngIf="isHandset$ | async">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="logo">Inspection & Audit System</span>
        </mat-toolbar>
        <mat-divider></mat-divider>
        <mat-nav-list>
          <a mat-list-item *ngFor="let item of navItems" [routerLink]="item.route" routerLinkActive="active" (click)="onNavClick()">
            <mat-icon mat-list-icon>{{ item.icon }}</mat-icon>
            <mat-list-item-title>{{ item.label }}</mat-list-item-title>
          </a>
        </mat-nav-list>
        <div class="spacer"></div>
        <mat-nav-list>
          <a mat-list-item (click)="logout()">
            <mat-icon mat-list-icon>exit_to_app</mat-icon>
            <mat-list-item-title>Logout</mat-list-item-title>
          </a>
        </mat-nav-list>
      </mat-s>

      <mat-s-content>
        <mat-toolbar class="main-toolbar">
          <button mat-icon-button (click)="toggleS()" *ngIf="isHandset$ | async">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="toolbar-title">Inspection & Audit Management</span>
          <span class="spacer"></span>
          <button mat-icon-button [mat-menu-trigger-for]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <div class="user-menu">
              <p class="user-name">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
              <p class="user-role">{{ currentUser?.role | titlecase }}</p>
            </div>
            <mat-divider></mat-divider>
            <a mat-menu-item [routerLink]="'/profile'">
              <mat-icon>person</mat-icon>Profile
            </a>
            <a mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>Logout
            </a>
          </mat-menu>
        </mat-toolbar>

        <div class="content-container">
          <router-outlet></router-outlet>
        </div>
      </mat-s-content>
    </mat-s-container>
  `,
  styles: [`
    .app-container { height: 100vh; }
    .snav-toolbar { background: #1a237e; color: white; }
    .logo { font-weight: 600; margin-left: 8px; }
    .spacer { flex: 1 1 auto; }
    .main-toolbar { background: #1a237e; color: white; position: sticky; top: 0; z-index: 100; }
    .toolbar-title { font-weight: 500; }
    .content-container { padding: 16px; background: #f5f5f5; min-height: calc(100vh - 64px); }
    .user-menu { padding: 12px 16px; min-width: 200px; }
    .user-name { margin: 0; font-weight: 600; }
    .user-role { margin: 0; font-size: 0.85rem; color: #666; }
    .active { background-color: rgba(255,255,255,0.08); }
    mat-s-content { background: #f5f5f5; }
  `]
})
export class AppComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private breakpointObserver = inject(BreakpointObserver);

  currentUser = this.authService.currentUser;

  isHandset$ = this.breakpointObserver
    .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
    .pipe(map(result => result.matches));

  sOpened = true;
  navItems = NAV_ITEMS;

  toggleS() { this.sOpened = !this.sOpened; }
  onNavClick() {
    if (this.isHandset$ | async) this.sOpened = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}