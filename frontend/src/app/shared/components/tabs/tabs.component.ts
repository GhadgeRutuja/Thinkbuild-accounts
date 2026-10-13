import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

@Component({
  selector: 'tb-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tb-tabs-container">
      <nav class="tb-tabs-nav" aria-label="Tabs">
        @for (tab of tabs; track tab.id) {
          <button
            type="button"
            class="tb-tab-btn"
            [class.tb-tab-btn--active]="tab.id === activeTab"
            (click)="selectTab(tab.id)">
            <span>{{ tab.label }}</span>
            @if (tab.count !== undefined) {
              <span class="tb-tab-count">{{ tab.count }}</span>
            }
          </button>
        }
      </nav>
    </div>
  `,
  styles: [`
    .tb-tabs-container {
      border-bottom: 1px solid var(--color-border);
      width: 100%;
    }
    .tb-tabs-nav {
      display: flex;
      gap: 24px;
      margin-bottom: -1px;
    }
    .tb-tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 0;
      border: none;
      background: transparent;
      font-family: var(--font-family);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-muted);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all var(--transition);
      white-space: nowrap;
    }
    .tb-tab-btn:hover {
      color: var(--color-text);
      border-bottom-color: var(--color-border);
    }
    .tb-tab-btn--active {
      color: var(--color-accent) !important;
      border-bottom-color: var(--color-accent) !important;
      font-weight: var(--font-weight-semibold);
    }
    .tb-tab-count {
      padding: 2px 6px;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      border-radius: 9999px;
      background: var(--color-canvas);
      color: var(--color-text-muted);
    }
    .tb-tab-btn--active .tb-tab-count {
      background: var(--color-accent-tint);
      color: var(--color-accent);
    }
  `]
})
export class TabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activeTab = '';
  @Output() tabChange = new EventEmitter<string>();

  selectTab(id: string) {
    if (this.activeTab !== id) {
      this.activeTab = id;
      this.tabChange.emit(id);
    }
  }
}
