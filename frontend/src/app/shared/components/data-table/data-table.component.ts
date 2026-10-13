import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

@Component({
  selector: 'tb-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tb-table-wrapper">
      <div class="tb-table-container">
        <table class="tb-table">
          <thead>
            <tr>
              @for (col of columns; track col.key) {
                <th
                  [style.width]="col.width || 'auto'"
                  [class.text-right]="col.align === 'right'"
                  [class.text-center]="col.align === 'center'"
                  [class.tb-th--sortable]="col.sortable"
                  (click)="onSort(col)">
                  <div class="tb-th-content" [class.justify-end]="col.align === 'right'" [class.justify-center]="col.align === 'center'">
                    <span>{{ col.label }}</span>
                    @if (col.sortable) {
                      <span class="tb-sort-indicator">
                        @if (sortKey() === col.key) {
                          @if (sortDirection() === 'asc') {
                            ▲
                          } @else {
                            ▼
                          }
                        } @else {
                          <span class="tb-sort-dim">↕</span>
                        }
                      </span>
                    }
                  </div>
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @if (loading) {
              @for (dummy of skeletonRows; track $index) {
                <tr class="tb-skeleton-row">
                  @for (col of columns; track col.key) {
                    <td><div class="tb-skeleton-shimmer"></div></td>
                  }
                </tr>
              }
            } @else if (sortedData().length === 0) {
              <tr>
                <td [attr.colspan]="columns.length" class="tb-empty-cell">
                  <div class="tb-empty-state">
                    <p>{{ emptyMessage }}</p>
                  </div>
                </td>
              </tr>
            } @else {
              @for (row of sortedData(); track $index) {
                <tr class="tb-data-row">
                  @for (col of columns; track col.key) {
                    <td
                      [class.text-right]="col.align === 'right'"
                      [class.text-center]="col.align === 'center'"
                      [class.tabular-nums]="col.align === 'right'">
                      {{ row[col.key] }}
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      @if (totalPages > 1) {
        <div class="tb-pagination">
          <div class="tb-pagination__info">
            Page {{ currentPage }} of {{ totalPages }}
          </div>
          <div class="tb-pagination__actions">
            <button
              type="button"
              class="tb-page-btn"
              [disabled]="currentPage <= 1 || loading"
              (click)="goToPage(currentPage - 1)">
              Previous
            </button>
            <button
              type="button"
              class="tb-page-btn"
              [disabled]="currentPage >= totalPages || loading"
              (click)="goToPage(currentPage + 1)">
              Next
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .tb-table-wrapper {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card);
      background: var(--color-surface);
      overflow: hidden;
      width: 100%;
    }
    .tb-table-container {
      overflow-x: auto;
      max-height: 600px;
    }
    .tb-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    thead {
      position: sticky;
      top: 0;
      background: var(--color-canvas);
      z-index: 10;
      border-bottom: 1px solid var(--color-border);
    }
    th {
      height: 40px;
      padding: 0 16px;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted);
      white-space: nowrap;
      user-select: none;
    }
    .tb-th--sortable {
      cursor: pointer;
    }
    .tb-th--sortable:hover {
      color: var(--color-text);
    }
    .tb-th-content {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .justify-end { justify-content: flex-end; }
    .justify-center { justify-content: center; }
    .tb-sort-indicator {
      font-size: 10px;
      display: inline-flex;
    }
    .tb-sort-dim {
      opacity: 0.35;
    }
    tbody tr {
      height: 44px;
      border-bottom: 1px solid var(--color-border);
      transition: background var(--transition);
    }
    tbody tr:last-child {
      border-bottom: none;
    }
    .tb-data-row:hover {
      background: #F8FAFC;
    }
    td {
      padding: 0 16px;
      font-size: var(--font-size-base);
      color: var(--color-text);
      white-space: nowrap;
    }
    .tb-empty-cell {
      padding: 40px 16px;
      text-align: center;
    }
    .tb-empty-state {
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }
    .tb-skeleton-row td {
      padding: 10px 16px;
    }
    .tb-skeleton-shimmer {
      height: 16px;
      border-radius: 4px;
      background: linear-gradient(90deg, #f0f3f6 25%, #e2e8f0 50%, #f0f3f6 75%);
      background-size: 200% 100%;
      animation: tb-shimmer 1.5s infinite;
    }
    @keyframes tb-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    .tb-pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-top: 1px solid var(--color-border);
      background: var(--color-surface);
    }
    .tb-pagination__info {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }
    .tb-pagination__actions {
      display: flex;
      gap: 8px;
    }
    .tb-page-btn {
      padding: 6px 12px;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-input);
      cursor: pointer;
      transition: all var(--transition);
    }
    .tb-page-btn:hover:not(:disabled) {
      background: var(--color-canvas);
    }
    .tb-page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class DataTableComponent {
  @Input() columns: ColumnDef[] = [];
  @Input() data: any[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No records found';
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  skeletonRows = [1, 2, 3, 4, 5];
  sortKey = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  sortedData = computed(() => {
    const list = [...(this.data || [])];
    const key = this.sortKey();
    const dir = this.sortDirection();
    if (!key) return list;

    return list.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      if (valA == null) return 1;
      if (valB == null) return -1;
      if (typeof valA === 'number' && typeof valB === 'number') {
        return dir === 'asc' ? valA - valB : valB - valA;
      }
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return dir === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  });

  onSort(col: ColumnDef) {
    if (!col.sortable) return;
    if (this.sortKey() === col.key) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(col.key);
      this.sortDirection.set('asc');
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
