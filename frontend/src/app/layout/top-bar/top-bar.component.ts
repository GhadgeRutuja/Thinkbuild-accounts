import { Component, Input, inject, signal, ElementRef, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="tb-topbar">
      <!-- Left: Title & Breadcrumbs -->
      <div class="tb-topbar__left">
        <div class="tb-breadcrumb">
          <span class="tb-breadcrumb__root">ThinkBuild</span>
          <span class="tb-breadcrumb__sep">/</span>
          <span class="tb-breadcrumb__current">{{ currentTitle() }}</span>
        </div>
      </div>

      <!-- Right: Store Switcher & User Menu -->
      <div class="tb-topbar__right">
        <!-- Store Switcher -->
        <div class="tb-store-dropdown" (click)="$event.stopPropagation()">
          <button
            type="button"
            class="tb-store-btn"
            (click)="toggleStoreDropdown()">
            <svg class="tb-store-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.25m12 0h7.5M3 10.5l9-7.5 9 7.5v9.75a.75.75 0 01-.75.75h-3.75" />
            </svg>
            <span class="tb-store-name">{{ selectedStore() }}</span>
            <svg class="tb-dropdown-arrow" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </button>

          @if (isStoreOpen()) {
            <div class="tb-dropdown-menu tb-store-menu">
              @for (store of stores; track store) {
                <div
                  class="tb-dropdown-item"
                  [class.tb-dropdown-item--active]="selectedStore() === store"
                  (click)="selectStore(store)">
                  {{ store }}
                </div>
              }
            </div>
          }
        </div>

        <!-- User Profile Dropdown -->
        <div class="tb-user-dropdown" (click)="$event.stopPropagation()">
          <button
            type="button"
            class="tb-user-btn"
            (click)="toggleUserDropdown()">
            <div class="tb-avatar">{{ userInitials() }}</div>
            <div class="tb-user-info">
              <span class="tb-user-name">{{ userName() }}</span>
              <span class="tb-user-role">{{ userRole() }}</span>
            </div>
            <svg class="tb-dropdown-arrow" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </button>

          @if (isUserOpen()) {
            <div class="tb-dropdown-menu tb-user-menu">
              <div class="tb-user-menu__header">
                <div class="tb-user-menu__name">{{ userName() }}</div>
                <div class="tb-user-menu__email">{{ userEmail() }}</div>
              </div>
              <div class="tb-dropdown-divider"></div>
              <button type="button" class="tb-dropdown-item tb-dropdown-item--danger" (click)="logout()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Sign Out
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .tb-topbar {
      height: var(--topbar-height);
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .tb-topbar__left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .tb-breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: var(--font-size-sm);
    }
    .tb-breadcrumb__root {
      color: var(--color-text-muted);
      font-weight: var(--font-weight-medium);
    }
    .tb-breadcrumb__sep {
      color: var(--color-border);
    }
    .tb-breadcrumb__current {
      color: var(--color-text);
      font-weight: var(--font-weight-semibold);
    }
    .tb-topbar__right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .tb-store-dropdown, .tb-user-dropdown {
      position: relative;
    }
    .tb-store-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      height: 32px;
      padding: 0 10px;
      background: var(--color-canvas);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-input);
      font-family: var(--font-family);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text);
      cursor: pointer;
      transition: all var(--transition);
    }
    .tb-store-btn:hover {
      background: #EDF2F7;
    }
    .tb-store-icon {
      width: 16px;
      height: 16px;
      color: var(--color-text-muted);
    }
    .tb-dropdown-arrow {
      width: 14px;
      height: 14px;
      color: var(--color-text-muted);
    }
    .tb-user-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 20px;
      transition: background var(--transition);
    }
    .tb-user-btn:hover {
      background: var(--color-canvas);
    }
    .tb-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #DBEAFE;
      color: var(--color-accent);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-xs);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tb-user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.2;
    }
    .tb-user-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text);
    }
    .tb-user-role {
      font-size: 11px;
      color: var(--color-text-muted);
      text-transform: capitalize;
    }
    .tb-dropdown-menu {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-dropdown);
      min-width: 180px;
      padding: 4px;
      z-index: 100;
      animation: fadeIn var(--transition);
    }
    .tb-store-menu {
      width: 160px;
    }
    .tb-user-menu {
      width: 220px;
    }
    .tb-user-menu__header {
      padding: 8px 12px;
    }
    .tb-user-menu__name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }
    .tb-user-menu__email {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      margin-top: 2px;
    }
    .tb-dropdown-divider {
      height: 1px;
      background: var(--color-border);
      margin: 4px 0;
    }
    .tb-dropdown-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 8px 12px;
      border-radius: 4px;
      border: none;
      background: transparent;
      color: var(--color-text);
      font-size: var(--font-size-sm);
      font-family: var(--font-family);
      cursor: pointer;
      text-align: left;
      transition: background var(--transition);
    }
    .tb-dropdown-item:hover {
      background: var(--color-canvas);
    }
    .tb-dropdown-item--active {
      background: var(--color-accent-tint);
      color: var(--color-accent);
      font-weight: var(--font-weight-medium);
    }
    .tb-dropdown-item--danger {
      color: var(--color-danger);
    }
    .tb-dropdown-item--danger svg {
      width: 16px;
      height: 16px;
    }
    .tb-dropdown-item--danger:hover {
      background: #FEE2E2;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class TopBarComponent {
  @Input() sidebarCollapsed = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  isStoreOpen = signal(false);
  isUserOpen = signal(false);
  selectedStore = signal('All Stores');

  stores = ['All Stores', 'Main Store', 'Secondary Store'];

  currentRoute = signal(this.router.url);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute.set(event.urlAfterRedirects || event.url);
    });
  }

  currentTitle = computed(() => {
    const url = this.currentRoute().split('?')[0].replace('/', '');
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      coa: 'Chart of Accounts',
      journal: 'Journal Entries',
      purchase: 'Purchases',
      sales: 'Sales',
      quotation: 'Quotations',
      pos: 'Point of Sale',
      inventory: 'Inventory',
      party: 'Parties',
      payment: 'Payments',
      receipt: 'Receipts',
      reports: 'Reports',
      users: 'Users & Roles',
      'audit-log': 'Audit Log'
    };
    return titles[url] || 'Overview';
  });

  userName = computed(() => this.authService.user()?.fullName || 'Administrator');
  userRole = computed(() => this.authService.user()?.role || 'Admin');
  userEmail = computed(() => this.authService.user()?.email || 'admin@thinkbuild.local');

  userInitials = computed(() => {
    const name = this.userName().trim();
    if (!name) return 'A';
    const parts = name.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  });

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isStoreOpen.set(false);
      this.isUserOpen.set(false);
    }
  }

  toggleStoreDropdown() {
    this.isStoreOpen.update(v => !v);
    this.isUserOpen.set(false);
  }

  toggleUserDropdown() {
    this.isUserOpen.update(v => !v);
    this.isStoreOpen.set(false);
  }

  selectStore(store: string) {
    this.selectedStore.set(store);
    this.isStoreOpen.set(false);
  }

  logout() {
    this.isUserOpen.set(false);
    this.authService.logout();
  }
}
