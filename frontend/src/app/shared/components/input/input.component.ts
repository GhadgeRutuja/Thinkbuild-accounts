import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'tb-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="tb-field" [class.tb-field--disabled]="disabled" [class.tb-field--error]="!!error">
      @if (label) {
        <label [for]="inputId" class="tb-label">
          {{ label }}
          @if (required) {
            <span class="tb-required">*</span>
          }
        </label>
      }
      <div class="tb-input-wrapper">
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          class="tb-input"
        />
        <ng-content select="[suffix]" />
      </div>
      @if (error) {
        <div class="tb-error-text">{{ error }}</div>
      } @else if (helperText) {
        <div class="tb-helper-text">{{ helperText }}</div>
      }
    </div>
  `,
  styles: [`
    .tb-field {
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
    .tb-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }
    .tb-input {
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
    .tb-input:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px var(--color-accent-tint);
    }
    .tb-input::placeholder {
      color: var(--color-text-muted);
    }
    .tb-field--error .tb-input {
      border-color: var(--color-danger);
    }
    .tb-field--error .tb-input:focus {
      box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.12);
    }
    .tb-field--disabled .tb-input {
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
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() error = '';
  @Input() helperText = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() inputId = `tb-input-${Math.random().toString(36).substring(2, 9)}`;

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
