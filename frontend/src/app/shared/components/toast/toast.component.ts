import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'tb-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tb-toast-container">
      @for (t of toastService.toasts(); track t.id) {
        <div [class]="'tb-toast tb-toast--' + t.type">
          <div class="tb-toast__icon">
            @switch (t.type) {
              @case ('success') {
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                </svg>
              }
              @case ('error') {
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                </svg>
              }
              @case ('warning') {
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
              }
              @default {
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
                </svg>
              }
            }
          </div>
          <div class="tb-toast__message">{{ t.message }}</div>
          <button type="button" class="tb-toast__close" (click)="toastService.remove(t.id)">
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .tb-toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 2000;
      pointer-events: none;
    }
    .tb-toast {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      max-width: 440px;
      padding: 12px 16px;
      background: var(--color-surface);
      border-radius: var(--radius-input);
      box-shadow: var(--shadow-modal);
      border: 1px solid var(--color-border);
      animation: toastSlideUp var(--transition);
      font-size: var(--font-size-sm);
    }
    .tb-toast__icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tb-toast__icon svg {
      width: 20px;
      height: 20px;
    }
    .tb-toast--success {
      border-left: 4px solid var(--color-success);
    }
    .tb-toast--success .tb-toast__icon {
      color: var(--color-success);
    }
    .tb-toast--error {
      border-left: 4px solid var(--color-danger);
    }
    .tb-toast--error .tb-toast__icon {
      color: var(--color-danger);
    }
    .tb-toast--warning {
      border-left: 4px solid var(--color-warning);
    }
    .tb-toast--warning .tb-toast__icon {
      color: var(--color-warning);
    }
    .tb-toast--info {
      border-left: 4px solid var(--color-accent);
    }
    .tb-toast--info .tb-toast__icon {
      color: var(--color-accent);
    }
    .tb-toast__message {
      flex: 1;
      color: var(--color-text);
      word-break: break-word;
    }
    .tb-toast__close {
      border: none;
      background: transparent;
      color: var(--color-text-muted);
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
      padding: 0 4px;
    }
    .tb-toast__close:hover {
      color: var(--color-text);
    }
    @keyframes toastSlideUp {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
