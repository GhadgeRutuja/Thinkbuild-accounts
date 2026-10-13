import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  route: string;
  module: string;
  icon: string; // SVG path or SVG string
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="tb-sidebar" [class.tb-sidebar--collapsed]="collapsed">
      <!-- Logo / Header -->
      <div class="tb-sidebar__header">
        <div class="tb-sidebar__brand">
          <div class="tb-sidebar__logo-badge">TB</div>
          @if (!collapsed) {
            <span class="tb-sidebar__brand-name">ThinkBuild</span>
          }
        </div>
        <button
          type="button"
          class="tb-sidebar__toggle"
          (click)="toggleCollapse.emit()"
          [title]="collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'">
          @if (collapsed) {
            <!-- Chevron Right -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          } @else {
            <!-- Chevron Left -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          }
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="tb-sidebar__nav">
        @for (group of navGroups; track group.title) {
          @if (hasVisibleItems(group)) {
            <div class="tb-nav-group">
              @if (!collapsed) {
                <div class="tb-nav-group__title">{{ group.title }}</div>
              }
              <ul class="tb-nav-group__list">
                @for (item of group.items; track item.route) {
                  @if (canView(item.module)) {
                    <li>
                      <a
                        [routerLink]="item.route"
                        routerLinkActive="tb-nav-item--active"
                        class="tb-nav-item"
                        [title]="collapsed ? item.label : ''">
                        <span class="tb-nav-item__icon" [innerHTML]="item.icon"></span>
                        @if (!collapsed) {
                          <span class="tb-nav-item__label">{{ item.label }}</span>
                        }
                      </a>
                    </li>
                  }
                }
              </ul>
            </div>
          }
        }
      </nav>
    </aside>
  `,
  styles: [`
    .tb-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: var(--sidebar-width);
      background: var(--color-surface);
      border-right: 1px solid var(--color-border);
      z-index: 100;
      display: flex;
      flex-direction: column;
      transition: width var(--transition);
      user-select: none;
    }
    .tb-sidebar--collapsed {
      width: var(--sidebar-collapsed);
    }
    .tb-sidebar__header {
      height: var(--topbar-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      border-bottom: 1px solid var(--color-border);
    }
    .tb-sidebar__brand {
      display: flex;
      align-items: center;
      gap: 10px;
      overflow: hidden;
    }
    .tb-sidebar__logo-badge {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-input);
      background: var(--color-accent);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      flex-shrink: 0;
    }
    .tb-sidebar__brand-name {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      white-space: nowrap;
    }
    .tb-sidebar__toggle {
      width: 28px;
      height: 28px;
      border-radius: 4px;
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition);
      flex-shrink: 0;
    }
    .tb-sidebar__toggle:hover {
      background: var(--color-canvas);
      color: var(--color-text);
    }
    .tb-sidebar__toggle svg {
      width: 16px;
      height: 16px;
    }
    .tb-sidebar__nav {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .tb-nav-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .tb-nav-group__title {
      font-size: 11px;
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted);
      padding: 0 8px;
      margin-bottom: 2px;
    }
    .tb-nav-group__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .tb-nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 36px;
      padding: 0 10px;
      border-radius: var(--radius-input);
      color: var(--color-text);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      transition: all var(--transition);
      text-decoration: none;
      white-space: nowrap;
    }
    .tb-sidebar--collapsed .tb-nav-item {
      justify-content: center;
      padding: 0;
    }
    .tb-nav-item:hover {
      background: var(--color-canvas);
      color: var(--color-text);
    }
    .tb-nav-item--active {
      background: var(--color-accent-tint) !important;
      color: var(--color-accent) !important;
    }
    .tb-nav-item__icon {
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .tb-nav-item__icon ::ng-deep svg {
      width: 18px;
      height: 18px;
      stroke-width: 1.5;
    }
    .tb-nav-item__label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  private authService = inject(AuthService);

  readonly navGroups: NavGroup[] = [
    {
      title: 'Overview',
      items: [
        {
          label: 'Dashboard',
          route: '/dashboard',
          module: 'DASHBOARD',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`
        }
      ]
    },
    {
      title: 'Accounting',
      items: [
        {
          label: 'Chart of Accounts',
          route: '/coa',
          module: 'COA',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`
        },
        {
          label: 'Journal Entries',
          route: '/journal',
          module: 'JOURNAL',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`
        },
        {
          label: 'Payments',
          route: '/payment',
          module: 'PAYMENT',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>`
        },
        {
          label: 'Receipts',
          route: '/receipt',
          module: 'RECEIPT',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="m8 12 4 4 4-4"/><path d="M12 8v8"/></svg>`
        }
      ]
    },
    {
      title: 'Trading',
      items: [
        {
          label: 'Quotations',
          route: '/quotation',
          module: 'QUOTATION',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`
        },
        {
          label: 'Sales',
          route: '/sales',
          module: 'SALES',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`
        },
        {
          label: 'Purchases',
          route: '/purchase',
          module: 'PURCHASE',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`
        },
        {
          label: 'Point of Sale',
          route: '/pos',
          module: 'POS',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`
        }
      ]
    },
    {
      title: 'Inventory',
      items: [
        {
          label: 'Items & Stock',
          route: '/inventory',
          module: 'INVENTORY',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`
        }
      ]
    },
    {
      title: 'Parties',
      items: [
        {
          label: 'Parties',
          route: '/party',
          module: 'PARTY',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
        }
      ]
    },
    {
      title: 'Reports',
      items: [
        {
          label: 'Reports',
          route: '/reports',
          module: 'REPORTS',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
        }
      ]
    },
    {
      title: 'Administration',
      items: [
        {
          label: 'Users & Roles',
          route: '/users',
          module: 'USERS',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
        },
        {
          label: 'Audit Log',
          route: '/audit-log',
          module: 'USERS',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`
        }
      ]
    }
  ];

  canView(module: string): boolean {
    // If user has not loaded or no explicit rule, allow view if admin or permission matches
    const user = this.authService.user();
    if (!user) {
      // In development or prior to login response, allow view
      return true;
    }
    return this.authService.can(module, 'VIEW');
  }

  hasVisibleItems(group: NavGroup): boolean {
    return group.items.some(item => this.canView(item.module));
  }
}
