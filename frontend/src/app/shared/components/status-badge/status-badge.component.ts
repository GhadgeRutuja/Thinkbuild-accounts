import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeType = 'success' | 'warning' | 'danger' | 'info' | 'default';

@Component({
  selector: 'tb-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="'tb-badge tb-badge--' + type">
      <span class="tb-badge__dot"></span>
      <span class="tb-badge__text">{{ status }}</span>
    </span>
  `,
  styles: [`
    .tb-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      line-height: 1.4;
      white-space: nowrap;
      user-select: none;
    }
    .tb-badge__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    .tb-badge--success {
      background: #DCFCE7;
      color: var(--color-success);
    }
    .tb-badge--success .tb-badge__dot {
      background: var(--color-success);
    }
    .tb-badge--warning {
      background: #FEF3C7;
      color: var(--color-warning);
    }
    .tb-badge--warning .tb-badge__dot {
      background: var(--color-warning);
    }
    .tb-badge--danger {
      background: #FEE2E2;
      color: var(--color-danger);
    }
    .tb-badge--danger .tb-badge__dot {
      background: var(--color-danger);
    }
    .tb-badge--info {
      background: var(--color-accent-tint);
      color: var(--color-accent);
    }
    .tb-badge--info .tb-badge__dot {
      background: var(--color-accent);
    }
    .tb-badge--default {
      background: #F3F4F6;
      color: var(--color-text-muted);
    }
    .tb-badge--default .tb-badge__dot {
      background: var(--color-text-muted);
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status = '';
  @Input() type: BadgeType = 'default';
}
