import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tb-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [class]="'tb-btn tb-btn--' + variant + (size === 'sm' ? ' tb-btn--sm' : '') + (disabled ? ' tb-btn--disabled' : '')"
      [disabled]="disabled || loading"
      [type]="type"
      (click)="clicked.emit($event)">
      @if (loading) {
        <span class="tb-btn__spinner"></span>
      }
      <ng-content />
    </button>
  `,
  styles: [`
    .tb-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 0 16px;
      height: 36px;
      border-radius: var(--radius-input);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      border: 1px solid transparent;
      transition: all var(--transition);
      font-family: var(--font-family);
      white-space: nowrap;
    }
    .tb-btn--primary {
      background: var(--color-accent);
      color: #fff;
      border-color: var(--color-accent);
    }
    .tb-btn--primary:hover:not(:disabled) {
      background: var(--color-accent-hover);
      border-color: var(--color-accent-hover);
    }
    .tb-btn--secondary {
      background: var(--color-surface);
      color: var(--color-text);
      border-color: var(--color-border);
    }
    .tb-btn--secondary:hover:not(:disabled) {
      background: var(--color-canvas);
    }
    .tb-btn--ghost {
      background: transparent;
      color: var(--color-text);
      border-color: transparent;
    }
    .tb-btn--ghost:hover:not(:disabled) {
      background: var(--color-canvas);
    }
    .tb-btn--danger {
      background: var(--color-danger);
      color: #fff;
      border-color: var(--color-danger);
    }
    .tb-btn--danger:hover:not(:disabled) {
      background: #991b1b;
    }
    .tb-btn--sm {
      height: 28px;
      padding: 0 10px;
      font-size: var(--font-size-sm);
    }
    .tb-btn--disabled, .tb-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .tb-btn__spinner {
      width: 14px;
      height: 14px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
  @Input() size: 'default' | 'sm' = 'default';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() clicked = new EventEmitter<Event>();
}
