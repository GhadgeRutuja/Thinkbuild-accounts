import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'tb-purchase',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, ButtonComponent],
  template: `
    <div class="tb-module-page">
      <tb-page-header
        title="Purchases"
        subtitle="Manage supplier purchase orders and bills">
      </tb-page-header>

      <div class="tb-empty-state-card">
        <div class="tb-empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="m7.5 4.27 9 5.15"/>
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
            <path d="m3.3 7 8.7 5 8.7-5"/>
            <path d="M12 22V12"/>
          </svg>
        </div>
        <h2 class="tb-empty-title">Purchases</h2>
        <p class="tb-empty-message">This module is coming in a later stage.</p>
        <div class="tb-empty-action">
          <a routerLink="/dashboard">
            <tb-button variant="secondary">Return to Dashboard</tb-button>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tb-module-page { display: flex; flex-direction: column; gap: 24px; }
    .tb-empty-state-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card);
      padding: 64px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }
    .tb-empty-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: var(--color-accent-tint);
      color: var(--color-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .tb-empty-icon svg { width: 28px; height: 28px; }
    .tb-empty-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0 0 6px 0;
    }
    .tb-empty-message {
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      margin: 0 0 20px 0;
    }
    .tb-empty-action { display: flex; gap: 8px; }
  `]
})
export class PurchaseComponent {}
