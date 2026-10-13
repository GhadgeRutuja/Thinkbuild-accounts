import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tb-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tb-page-header">
      <div class="tb-page-header__left">
        <h1 class="tb-page-header__title">{{ title }}</h1>
        @if (subtitle) {
          <p class="tb-page-header__subtitle">{{ subtitle }}</p>
        }
      </div>
      <div class="tb-page-header__actions">
        <ng-content select="[header-actions]" />
      </div>
    </div>
  `,
  styles: [`
    .tb-page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
    }
    .tb-page-header__left {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .tb-page-header__title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      line-height: 1.2;
      margin: 0;
    }
    .tb-page-header__subtitle {
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      margin: 0;
    }
    .tb-page-header__actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
  `]
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
