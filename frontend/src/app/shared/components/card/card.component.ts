import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tb-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tb-card" [class.tb-card--no-padding]="noPadding">
      @if (title || hasHeaderSlot) {
        <div class="tb-card__header">
          <div class="tb-card__header-text">
            @if (title) {
              <h3 class="tb-card__title">{{ title }}</h3>
            }
            @if (subtitle) {
              <p class="tb-card__subtitle">{{ subtitle }}</p>
            }
          </div>
          <div class="tb-card__actions">
            <ng-content select="[card-header-actions]" />
          </div>
        </div>
      }

      <div class="tb-card__content">
        <ng-content />
      </div>

      <div class="tb-card__footer">
        <ng-content select="[card-footer]" />
      </div>
    </div>
  `,
  styles: [`
    .tb-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }
    .tb-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-border);
    }
    .tb-card__header-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .tb-card__title {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0;
    }
    .tb-card__subtitle {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin: 0;
    }
    .tb-card__actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tb-card__content {
      padding: 20px;
      flex: 1;
    }
    .tb-card--no-padding .tb-card__content {
      padding: 0;
    }
    .tb-card__footer {
      display: flex;
    }
    .tb-card__footer:not(:empty) {
      padding: 12px 20px;
      background: var(--color-canvas);
      border-top: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() noPadding = false;
  @Input() hasHeaderSlot = false;
}
