import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tb-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open) {
      <div class="tb-drawer-backdrop" (click)="close()">
        <div
          class="tb-drawer-container"
          [style.width]="width"
          (click)="$event.stopPropagation()">
          <div class="tb-drawer-header">
            <h3 class="tb-drawer-title">{{ title }}</h3>
            <button type="button" class="tb-drawer-close" (click)="close()" aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="tb-drawer-body">
            <ng-content />
          </div>
          <div class="tb-drawer-footer">
            <ng-content select="[drawer-footer]" />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .tb-drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(17, 24, 39, 0.45);
      backdrop-filter: blur(2px);
      z-index: 1000;
      display: flex;
      justify-content: flex-end;
      animation: fadeIn var(--transition);
    }
    .tb-drawer-container {
      background: var(--color-surface);
      height: 100%;
      max-width: 90vw;
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
      display: flex;
      flex-direction: column;
      animation: slideIn var(--transition);
    }
    .tb-drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-border);
    }
    .tb-drawer-title {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0;
    }
    .tb-drawer-close {
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
    .tb-drawer-close:hover {
      background: var(--color-canvas);
      color: var(--color-text);
    }
    .tb-drawer-close svg {
      width: 18px;
      height: 18px;
    }
    .tb-drawer-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }
    .tb-drawer-footer:not(:empty) {
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
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
  `]
})
export class DrawerComponent {
  @Input() title = '';
  @Input() open = false;
  @Input() width = '480px';
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
