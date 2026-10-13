import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'tb-money-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MoneyInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="tb-money-field" [class.tb-money-field--error]="!!error" [class.tb-money-field--disabled]="disabled">
      @if (label) {
        <label [for]="inputId" class="tb-label">
          {{ label }}
          @if (required) {
            <span class="tb-required">*</span>
          }
        </label>
      }
      <div class="tb-money-wrapper">
        @if (currency) {
          <span class="tb-currency-prefix">{{ currency }}</span>
        }
        <input
          [id]="inputId"
          type="text"
          inputmode="decimal"
          [placeholder]="placeholder || '0.' + '0'.repeat(decimals)"
          [disabled]="disabled"
          [value]="displayValue"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          class="tb-money-input tabular-nums"
        />
      </div>
      @if (error) {
        <div class="tb-error-text">{{ error }}</div>
      } @else if (helperText) {
        <div class="tb-helper-text">{{ helperText }}</div>
      }
    </div>
  `,
  styles: [`
    .tb-money-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
      font-family: var(--font-family);
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
    .tb-money-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-input);
      transition: border-color var(--transition), box-shadow var(--transition);
    }
    .tb-money-wrapper:focus-within {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px var(--color-accent-tint);
    }
    .tb-currency-prefix {
      padding-left: 12px;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-muted);
      user-select: none;
    }
    .tb-money-input {
      width: 100%;
      height: 36px;
      padding: 0 12px;
      font-size: var(--font-size-base);
      font-family: var(--font-family);
      color: var(--color-text);
      background: transparent;
      border: none;
      outline: none;
      text-align: right;
    }
    .tb-money-input::placeholder {
      color: var(--color-text-muted);
    }
    .tb-money-field--error .tb-money-wrapper {
      border-color: var(--color-danger);
    }
    .tb-money-field--error .tb-money-wrapper:focus-within {
      box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.12);
    }
    .tb-money-field--disabled .tb-money-wrapper {
      background: var(--color-canvas);
      cursor: not-allowed;
      opacity: 0.7;
    }
    .tb-money-field--disabled .tb-money-input {
      cursor: not-allowed;
    }
    .tb-error-text {
      font-size: var(--font-size-xs);
      color: var(--color-danger);
    }
    .tb-helper-text {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }
  `]
})
export class MoneyInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() currency = 'OMR';
  @Input() decimals = 3;
  @Input() placeholder = '';
  @Input() error = '';
  @Input() helperText = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() inputId = `tb-money-${Math.random().toString(36).substring(2, 9)}`;

  value: number | null = null;
  displayValue = '';

  onChange: (val: number | null) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: any): void {
    if (val !== null && val !== undefined && val !== '') {
      const num = Number(val);
      this.value = isNaN(num) ? null : num;
      this.displayValue = this.value !== null ? this.value.toFixed(this.decimals) : '';
    } else {
      this.value = null;
      this.displayValue = '';
    }
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

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const raw = target.value.trim();
    if (!raw) {
      this.value = null;
      this.onChange(null);
      return;
    }
    const clean = raw.replace(/[^0-9.-]/g, '');
    const num = parseFloat(clean);
    this.value = isNaN(num) ? null : num;
    this.onChange(this.value);
  }

  onBlur(): void {
    if (this.value !== null) {
      this.displayValue = this.value.toFixed(this.decimals);
    } else {
      this.displayValue = '';
    }
    this.onTouched();
  }
}
