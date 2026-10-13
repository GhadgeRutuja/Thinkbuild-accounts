import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

interface DashboardModule {
  title: string;
  description: string;
  route: string;
  module: string;
  badge: string;
  icon: string;
}

@Component({
  selector: 'tb-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, CardComponent, StatusBadgeComponent],
  template: `
    <div class="tb-dashboard">
      <tb-page-header
        title="Dashboard"
        subtitle="Overview of your accounting and trading activities">
      </tb-page-header>

      <!-- Key Metrics Row -->
      <div class="tb-stats-grid">
        <div class="tb-stat-card">
          <div class="tb-stat-header">
            <span class="tb-stat-title">Cash & Bank</span>
            <span class="tb-stat-pill tb-stat-pill--success">+2.4%</span>
          </div>
          <div class="tb-stat-value tabular-nums">OMR 24,850.500</div>
          <div class="tb-stat-footer text-muted">Across 3 active accounts</div>
        </div>

        <div class="tb-stat-card">
          <div class="tb-stat-header">
            <span class="tb-stat-title">Accounts Receivable</span>
            <span class="tb-stat-pill tb-stat-pill--warning">12 pending</span>
          </div>
          <div class="tb-stat-value tabular-nums">OMR 8,120.250</div>
          <div class="tb-stat-footer text-muted">From 18 customers</div>
        </div>

        <div class="tb-stat-card">
          <div class="tb-stat-header">
            <span class="tb-stat-title">Accounts Payable</span>
            <span class="tb-stat-pill tb-stat-pill--info">5 due</span>
          </div>
          <div class="tb-stat-value tabular-nums">OMR 4,680.000</div>
          <div class="tb-stat-footer text-muted">To 7 vendors</div>
        </div>

        <div class="tb-stat-card">
          <div class="tb-stat-header">
            <span class="tb-stat-title">Net Sales (MTD)</span>
            <span class="tb-stat-pill tb-stat-pill--success">+14.8%</span>
          </div>
          <div class="tb-stat-value tabular-nums">OMR 15,340.750</div>
          <div class="tb-stat-footer text-muted">98 transactions recorded</div>
        </div>
      </div>

      <!-- Modules Navigation Grid -->
      <div class="tb-section-header">
        <h2 class="tb-section-title">Core Modules</h2>
        <span class="tb-section-subtitle">Navigate to accounting and trading workflows</span>
      </div>

      <div class="tb-modules-grid">
        @for (m of modules; track m.route) {
          <a [routerLink]="m.route" class="tb-module-card">
            <div class="tb-module-card__header">
              <div class="tb-module-card__icon" [innerHTML]="m.icon"></div>
              <tb-status-badge [status]="m.badge" type="info"></tb-status-badge>
            </div>
            <div class="tb-module-card__body">
              <h3 class="tb-module-card__title">{{ m.title }}</h3>
              <p class="tb-module-card__desc">{{ m.description }}</p>
            </div>
            <div class="tb-module-card__footer">
              <span class="tb-module-card__link-text">Open Module</span>
              <svg viewBox="0 0 20 20" fill="currentColor" class="tb-arrow-icon">
                <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
              </svg>
            </div>
          </a>
        }
      </div>
    </div>
  `,
  styles: [`
    .tb-dashboard {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .tb-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }
    .tb-stat-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card);
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }
    .tb-stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tb-stat-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-muted);
    }
    .tb-stat-pill {
      font-size: 11px;
      font-weight: var(--font-weight-medium);
      padding: 2px 6px;
      border-radius: 4px;
    }
    .tb-stat-pill--success { background: #DCFCE7; color: var(--color-success); }
    .tb-stat-pill--warning { background: #FEF3C7; color: var(--color-warning); }
    .tb-stat-pill--info { background: var(--color-accent-tint); color: var(--color-accent); }
    .tb-stat-value {
      font-size: 22px;
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      letter-spacing: -0.01em;
    }
    .tb-stat-footer {
      font-size: var(--font-size-xs);
    }
    .tb-section-header {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .tb-section-title {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0;
    }
    .tb-section-subtitle {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }
    .tb-modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .tb-module-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-decoration: none;
      transition: all var(--transition);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }
    .tb-module-card:hover {
      border-color: var(--color-accent);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
    }
    .tb-module-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tb-module-card__icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--color-canvas);
      color: var(--color-accent);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tb-module-card__icon ::ng-deep svg {
      width: 20px;
      height: 20px;
      stroke-width: 1.8;
    }
    .tb-module-card__body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .tb-module-card__title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0;
    }
    .tb-module-card__desc {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin: 0;
      line-height: 1.4;
    }
    .tb-module-card__footer {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-accent);
      padding-top: 8px;
      border-top: 1px solid var(--color-border);
    }
    .tb-arrow-icon {
      width: 14px;
      height: 14px;
      transition: transform var(--transition);
    }
    .tb-module-card:hover .tb-arrow-icon {
      transform: translateX(3px);
    }
  `]
})
export class DashboardComponent {
  private authService = inject(AuthService);

  readonly modules: DashboardModule[] = [
    {
      title: 'Chart of Accounts',
      description: 'Manage assets, liabilities, equity, revenues, and expenses tree.',
      route: '/coa',
      module: 'COA',
      badge: 'Accounting',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`
    },
    {
      title: 'Journal Entries',
      description: 'Record balanced manual debit/credit accounting vouchers.',
      route: '/journal',
      module: 'JOURNAL',
      badge: 'Accounting',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`
    },
    {
      title: 'Sales & Invoicing',
      description: 'Issue sales invoices, record customer orders and dispatch.',
      route: '/sales',
      module: 'SALES',
      badge: 'Trading',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`
    },
    {
      title: 'Purchases & Bills',
      description: 'Process purchase orders, supplier bills, and inward goods.',
      route: '/purchase',
      module: 'PURCHASE',
      badge: 'Trading',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`
    },
    {
      title: 'Quotations',
      description: 'Prepare price estimations and quotations for customers.',
      route: '/quotation',
      module: 'QUOTATION',
      badge: 'Trading',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`
    },
    {
      title: 'Point of Sale (POS)',
      description: 'Fast barcode checkout and retail register management.',
      route: '/pos',
      module: 'POS',
      badge: 'Retail',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`
    },
    {
      title: 'Inventory & Stock',
      description: 'Track items, multi-store stock levels, transfers, and valuation.',
      route: '/inventory',
      module: 'INVENTORY',
      badge: 'Stock',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`
    },
    {
      title: 'Customer & Vendor Parties',
      description: 'Manage master contacts, VAT IDs, credit terms, and balances.',
      route: '/party',
      module: 'PARTY',
      badge: 'Directory',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
    },
    {
      title: 'Payments & Disbursements',
      description: 'Issue supplier payments and bank transfer vouchers.',
      route: '/payment',
      module: 'PAYMENT',
      badge: 'Finance',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>`
    },
    {
      title: 'Receipts & Collections',
      description: 'Collect incoming funds against customer invoices.',
      route: '/receipt',
      module: 'RECEIPT',
      badge: 'Finance',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="m8 12 4 4 4-4"/><path d="M12 8v8"/></svg>`
    },
    {
      title: 'Financial Reports',
      description: 'Generate Trial Balance, Profit & Loss, Balance Sheet, and VAT.',
      route: '/reports',
      module: 'REPORTS',
      badge: 'Analytics',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
    },
    {
      title: 'Users & Roles',
      description: 'Manage user access, module-level granular permissions.',
      route: '/users',
      module: 'USERS',
      badge: 'Admin',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
    }
  ];
}
