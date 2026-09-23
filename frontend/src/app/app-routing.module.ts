import { Routes, provideRouter } from '@angular/router';

const routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent) },
  { path: 'inspections', loadComponent: () => import('./inspections/inspection-list/inspection-list.component').then(c => c.InspectionListComponent) },
  { path: 'inspections/new', loadComponent: () => import('./inspections/inspection-form/inspection-form.component').then(c => c.InspectionFormComponent) },
  { path: 'inspections/:id', loadComponent: () => import('./inspections/inspection-detail/inspection-detail.component').then(c => c.InspectionDetailComponent) },
  { path: 'inspections/:id/edit', loadComponent: () => import('./inspections/inspection-form/inspection-form.component').then(c => c.InspectionFormComponent) },
  { path: 'findings', loadComponent: () => import('./findings/finding-list/finding-list.component').then(c => c.FindingListComponent) },
  { path: 'findings/new', loadComponent: () => import('./findings/finding-form/finding-form.component').then(c => c.FindingFormComponent) },
  { path: 'findings/:id', loadComponent: () => import('./findings/finding-detail/finding-detail.component').then(c => c.FindingDetailComponent) },
  { path: 'reports', loadComponent: () => import('./reports/report-list/report-list.component').then(c => c.ReportListComponent) },
  { path: 'reports/:id', loadComponent: () => import('./reports/report-detail/report-detail.component').then(c => c.ReportDetailComponent) },
  { path: 'audits', loadComponent: () => import('./audits/audit-list/audit-list.component').then(c => c.AuditListComponent) },
  { path: 'audits/new', loadComponent: () => import('./audits/audit-form/audit-form.component').then(c => c.AuditFormComponent) },
  { path: 'audits/:id', loadComponent: () => import('./audits/audit-detail/audit-detail.component').then(c => c.AuditDetailComponent) },
  { path: 'audit-findings', loadComponent: () => import('./audit-findings/audit-finding-list/audit-finding-list.component').then(c => c.AuditFindingListComponent) },
  { path: 'audit-findings/new', loadComponent: () => import('./audit-findings/audit-finding-form/audit-finding-form.component').then(c => c.AuditFindingFormComponent) },
  { path: 'users', loadComponent: () => import('./users/user-list/user-list.component').then(c => c.UserListComponent) },
  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent) },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

export { routes };