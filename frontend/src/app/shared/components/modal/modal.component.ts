import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tb-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div class="tb-modal-backdrop" (click)="close()">
        <div class="tb-modal-container" (click)="$event.stopPropagation()">
          <div class="tb-modal-header">
            <h3 class="tb-modal-title">{{ title }}</h3>
            <button type="button" class="tb-modal-close" (click)="close()" aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="tb-modal-body">
            <ng-content />
          </div>
          <div class="tb-modal-footer">
            <ng-content select="[modal-footer]" />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .tb-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(17, 24, 39, 0.45);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn var(--transition);
    }
    .tb-modal-container {
      background: var(--color-surface);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-modal);
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: scaleUp var(--transition);
      overflow: hidden;
    }
    .tb-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-border);
    }
    .tb-modal-title {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0;
    }
    .tb-modal-close {
      width: 28px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--color-text-muted);
      cursor: pointer;
      border-radius: 4px;
      transition: all var(--transition);
    }
    .tb-modal-close:hover {
      background: var(--color-canvas);
      color: var(--color-text);
    }
    .tb-modal-close svg {
      width: 18px;
      height: 18px;
    }
    .tb-modal-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }
    .tb-modal-footer:not(:empty) {
      padding: 12px 20px;
      border-top: 1px solid var(--color-border);
      background: var(--color-canvas);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.96); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class ModalComponent {
  @Input() title = '';
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.open) {
      this.close();
    }
  }

  close() {
    this.closed.emit();
  }
}
