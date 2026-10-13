import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'coa',
        loadComponent: () => import('./features/coa/coa.component').then(m => m.CoaComponent)
      },
      {
        path: 'journal',
        loadComponent: () => import('./features/journal/journal.component').then(m => m.JournalComponent)
      },
      {
        path: 'purchase',
        loadComponent: () => import('./features/purchase/purchase.component').then(m => m.PurchaseComponent)
      },
      {
        path: 'sales',
        loadComponent: () => import('./features/sales/sales.component').then(m => m.SalesComponent)
      },
      {
        path: 'quotation',
        loadComponent: () => import('./features/quotation/quotation.component').then(m => m.QuotationComponent)
      },
      {
        path: 'pos',
        loadComponent: () => import('./features/pos/pos.component').then(m => m.PosComponent)
      },
      {
        path: 'inventory',
        loadComponent: () => import('./features/inventory/inventory.component').then(m => m.InventoryComponent)
      },
      {
        path: 'party',
        loadComponent: () => import('./features/party/party.component').then(m => m.PartyComponent)
      },
      {
        path: 'payment',
        loadComponent: () => import('./features/payment/payment.component').then(m => m.PaymentComponent)
      },
      {
        path: 'receipt',
        loadComponent: () => import('./features/receipt/receipt.component').then(m => m.ReceiptComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'audit-log',
        loadComponent: () => import('./features/audit-log/audit-log.component').then(m => m.AuditLogComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
