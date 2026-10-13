import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'tb-quotation',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent, ButtonComponent],
  template: `
    <div class="tb-module-page">
      <tb-page-header
        title="Quotations"
        subtitle="Create price quotations and estimates for prospects">
      </tb-page-header>

      <div class="tb-empty-state-card">
        <div class="tb-empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <h2 class="tb-empty-title">Quotations</h2>
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
export class QuotationComponent {}
