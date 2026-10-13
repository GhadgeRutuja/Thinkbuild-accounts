import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'tb-date-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="tb-date-field" [class.tb-date-field--error]="!!error" [class.tb-date-field--disabled]="disabled">
      @if (label) {
        <label [for]="inputId" class="tb-label">
          {{ label }}
          @if (required) {
            <span class="tb-required">*</span>
          }
        </label>
      }
      <div class="tb-date-input-wrapper">
        <input
          [id]="inputId"
          type="date"
          [min]="min"
          [max]="max"
          [disabled]="disabled"
          [value]="value"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          class="tb-date-input"
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
    .tb-date-field {
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
    .tb-date-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }
    .tb-date-input {
      width: 100%;
      height: 36px;
      padding: 0 12px;
      font-size: var(--font-size-base);
      font-family: var(--font-family);
      color: var(--color-text);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-input);
      outline: none;
      transition: border-color var(--transition), box-shadow var(--transition);
    }
    .tb-date-input:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px var(--color-accent-tint);
    }
    .tb-date-field--error .tb-date-input {
      border-color: var(--color-danger);
    }
    .tb-date-field--error .tb-date-input:focus {
      box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.12);
    }
    .tb-date-field--disabled .tb-date-input {
      background: var(--color-canvas);
      cursor: not-allowed;
      opacity: 0.7;
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
export class DateInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() min = '';
  @Input() max = '';
  @Input() error = '';
  @Input() helperText = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() inputId = `tb-date-${Math.random().toString(36).substring(2, 9)}`;

  value = '';

  onChange: (val: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: any): void {
    this.value = val ?? '';
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
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
