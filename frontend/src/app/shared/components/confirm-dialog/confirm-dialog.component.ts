import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'tb-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  template: `
    <tb-modal [title]="title" [open]="open" (closed)="onCancel()">
      <div class="tb-confirm-content">
        <div class="tb-confirm-icon" [class.tb-confirm-icon--danger]="isDestructive">
          @if (isDestructive) {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.01" />
            </svg>
          }
        </div>
        <p class="tb-confirm-message">{{ message }}</p>
      </div>

      <div modal-footer class="tb-confirm-actions">
        <tb-button variant="secondary" (clicked)="onCancel()">
          {{ cancelText }}
        </tb-button>
        <tb-button [variant]="isDestructive ? 'danger' : 'primary'" [loading]="loading" (clicked)="onConfirm()">
          {{ confirmText }}
        </tb-button>
      </div>
    </tb-modal>
  `,
  styles: [`
    .tb-confirm-content {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }
    .tb-confirm-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--color-canvas);
      color: var(--color-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .tb-confirm-icon svg {
      width: 24px;
      height: 24px;
    }
    .tb-confirm-icon--danger {
      background: #FEE2E2;
      color: var(--color-danger);
    }
    .tb-confirm-message {
      font-size: var(--font-size-base);
      color: var(--color-text);
      line-height: 1.5;
      margin: 0;
      padding-top: 8px;
    }
    .tb-confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      width: 100%;
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() isDestructive = false;
  @Input() loading = false;
  @Input() open = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
