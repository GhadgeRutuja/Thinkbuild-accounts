import { Component, Input, forwardRef, signal, computed, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'tb-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="tb-select-field" [class.tb-select-field--error]="!!error" [class.tb-select-field--disabled]="disabled">
      @if (label) {
        <label class="tb-label">
          {{ label }}
          @if (required) {
            <span class="tb-required">*</span>
          }
        </label>
      }

      <div class="tb-select-container">
        <button
          type="button"
          class="tb-select-trigger"
          [disabled]="disabled"
          (click)="toggleOpen()">
          <span class="tb-selected-value" [class.tb-placeholder]="!selectedLabel()">
            {{ selectedLabel() || placeholder }}
          </span>
          <svg class="tb-chevron" [class.tb-chevron--open]="isOpen()" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </button>

        @if (isOpen()) {
          <div class="tb-select-dropdown">
            <div class="tb-search-box">
              <input
                type="text"
                class="tb-search-input"
                placeholder="Search..."
                [value]="searchQuery()"
                (input)="onSearchInput($event)"
                (click)="$event.stopPropagation()"
                autofocus
              />
            </div>

            <ul class="tb-options-list">
              @if (filteredOptions().length === 0) {
                <li class="tb-option-empty">No options found</li>
              } @else {
                @for (opt of filteredOptions(); track opt.value) {
                  <li
                    class="tb-option"
                    [class.tb-option--selected]="opt.value === value"
                    (click)="selectOption(opt)">
                    <span>{{ opt.label }}</span>
                    @if (opt.value === value) {
                      <svg class="tb-check-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                      </svg>
                    }
                  </li>
                }
              }
            </ul>
          </div>
        }
      </div>

      @if (error) {
        <div class="tb-error-text">{{ error }}</div>
      }
    </div>
  `,
  styles: [`
    .tb-select-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
      font-family: var(--font-family);
      position: relative;
    }
    .tb-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text);
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .tb-required {
      color: var(--color-danger);
    }
    .tb-select-container {
      position: relative;
      width: 100%;
    }
    .tb-select-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 36px;
      padding: 0 12px;
      font-size: var(--font-size-base);
      font-family: var(--font-family);
      color: var(--color-text);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-input);
      cursor: pointer;
      text-align: left;
      transition: border-color var(--transition), box-shadow var(--transition);
    }
    .tb-select-trigger:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px var(--color-accent-tint);
    }
    .tb-placeholder {
      color: var(--color-text-muted);
    }
    .tb-chevron {
      width: 16px;
      height: 16px;
      color: var(--color-text-muted);
      transition: transform var(--transition);
      flex-shrink: 0;
    }
    .tb-chevron--open {
      transform: rotate(180deg);
    }
    .tb-select-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-input);
      box-shadow: var(--shadow-dropdown);
      z-index: 50;
      max-height: 240px;
      display: flex;
      flex-direction: column;
    }
    .tb-search-box {
      padding: 8px;
      border-bottom: 1px solid var(--color-border);
    }
    .tb-search-input {
      width: 100%;
      height: 30px;
      padding: 0 8px;
      font-size: var(--font-size-sm);
      font-family: var(--font-family);
      border: 1px solid var(--color-border);
      border-radius: 4px;
      outline: none;
    }
    .tb-search-input:focus {
      border-color: var(--color-accent);
    }
    .tb-options-list {
      list-style: none;
      padding: 4px 0;
      margin: 0;
      overflow-y: auto;
      max-height: 190px;
    }
    .tb-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      font-size: var(--font-size-base);
      color: var(--color-text);
      cursor: pointer;
      transition: background var(--transition);
    }
    .tb-option:hover {
      background: var(--color-canvas);
    }
    .tb-option--selected {
      background: var(--color-accent-tint);
      color: var(--color-accent);
      font-weight: var(--font-weight-medium);
    }
    .tb-check-icon {
      width: 16px;
      height: 16px;
      color: var(--color-accent);
    }
    .tb-option-empty {
      padding: 12px;
      text-align: center;
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }
    .tb-select-field--error .tb-select-trigger {
      border-color: var(--color-danger);
    }
    .tb-select-field--disabled .tb-select-trigger {
      background: var(--color-canvas);
      cursor: not-allowed;
      opacity: 0.7;
    }
    .tb-error-text {
      font-size: var(--font-size-xs);
      color: var(--color-danger);
    }
  `]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Select...';
  @Input() error = '';
  @Input() disabled = false;
  @Input() required = false;

  private elementRef = inject(ElementRef);

  isOpen = signal(false);
  searchQuery = signal('');
  value: any = null;

  filteredOptions = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.options;
    return this.options.filter(o => o.label.toLowerCase().includes(q));
  });

  selectedLabel = computed(() => {
    const found = this.options.find(o => o.value === this.value);
    return found ? found.label : '';
  });

  onChange: (val: any) => void = () => {};
  onTouched: () => void = () => {};

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggleOpen() {
    if (!this.disabled) {
      this.isOpen.update(v => !v);
      if (!this.isOpen()) {
        this.onTouched();
      } else {
        this.searchQuery.set('');
      }
    }
  }

  selectOption(opt: SelectOption) {
    this.value = opt.value;
    this.onChange(this.value);
    this.isOpen.set(false);
    this.onTouched();
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  writeValue(val: any): void {
    this.value = val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
