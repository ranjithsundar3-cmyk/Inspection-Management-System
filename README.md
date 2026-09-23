# Inspection & Audit Management System

A comprehensive web application for managing inspections, audits, findings, and reports. Built with Angular 17, Node.js/Express, TypeORM, and SQLite.

## Features

### Backend (Node.js + Express + TypeORM + SQLite)
- **Authentication & Authorization**: JWT-based auth with role-based access control (Admin, Inspector, Auditor, Viewer)
- **Inspection Management**: Create, schedule, track, and complete inspections
- **Finding Management**: Track issues with severity, category, and status
- **Audit Management**: Full audit lifecycle from planning to completion
- **Report Generation**: Automated report generation from inspections/audits
- **Statistics & Analytics**: Dashboard metrics and reporting

### Frontend (Angular 17 + Material Design)
- **Responsive Design**: Mobile-first approach with Angular Material
- **Dashboard**: Overview with statistics and quick actions
- **CRUD Operations**: Full management interfaces for all entities
- **Real-time Updates**: Reactive data binding
- **Authentication Guards**: Protected routes with role-based access

## Prerequisites

- Node.js (v16+)
- npm or yarn
- SQLite (included via sqlite3 package)

## Getting Started

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Edit .env with your settings
npm run dev  # Starts server on http://localhost:3000
```

### Frontend Setup

```bash
cd frontend
npm install
ng serve  # Starts dev server on http://localhost:4200
```

## Project Structure

```
backend/
├── src/
│   ├── entities/          # TypeORM entities
│   ├── controllers/       # Route controllers
│   ├── services/          # Business logic
│   ├── middleware/        # Auth middleware
│   ├── routes/            # API routes
│   └── server.ts          # Main entry point
└── database/              # SQLite database

frontend/
├── src/app/
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard component
│   ├── inspections/       # Inspection components
│   ├── findings/          # Finding components
│   ├── reports/           # Report components
│   ├── audits/            # Audit components
│   ├── audit-findings/    # Audit finding components
│   ├── users/             # User management
│   ├── profile/           # User profile
│   ├── shared/            # Shared services and models
│   └── app.component.ts   # Main layout
└── src/environments/      # Environment configs
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register (Admin only)
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/me` - Update profile

### Inspections
- `GET /api/v1/inspections` - List inspections
- `POST /api/v1/inspections` - Create inspection
- `GET /api/v1/inspections/:id` - Get inspection
- `PUT /api/v1/inspections/:id` - Update inspection
- `DELETE /api/v1/inspections/:id` - Delete inspection
- `GET /api/v1/inspections/statistics` - Get statistics

### Findings
- `GET /api/v1/findings` - List findings
- `POST /api/v1/findings` - Create finding
- `GET /api/v1/findings/:id` - Get finding
- `PUT /api/v1/findings/:id` - Update finding
- `DELETE /api/v1/findings/:id` - Delete finding

### Reports
- `POST /api/v1/reports/generate` - Generate report
- `GET /api/v1/reports` - List reports
- `GET /api/v1/reports/:id` - Get report
- `PUT /api/v1/reports/:id` - Update report status
- `DELETE /api/v1/reports/:id` - Delete report

### Audits
- `GET /api/v1/audits` - List audits
- `POST /api/v1/audits` - Create audit
- `GET /api/v1/audits/:id` - Get audit
- `PUT /api/v1/audits/:id` - Update audit
- `DELETE /api/v1/audits/:id` - Delete audit
- `POST /api/v1/audits/:id/auditors` - Add auditors
- `DELETE /api/v1/audits/:id/auditors/:auditorId` - Remove auditor

### Audit Findings
- `GET /api/v1/audit-findings` - List audit findings
- `POST /api/v1/audit-findings` - Create audit finding
- `GET /api/v1/audit-findings/:id` - Get audit finding
- `PUT /api/v1/audit-findings/:id` - Update audit finding
- `DELETE /api/v1/audit-findings/:id` - Delete audit finding

## Default Admin Account

After initial setup, create an admin user via the registration endpoint or directly in the database.

## License

MIT