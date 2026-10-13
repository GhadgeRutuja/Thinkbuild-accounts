import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'tb-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    <div class="tb-login-page">
      <div class="tb-login-card">
        <!-- Wordmark & Subtitle -->
        <div class="tb-login-header">
          <h1 class="tb-wordmark">ThinkBuild Accounts</h1>
          <p class="tb-subtitle">Sign in to your account</p>
        </div>

        <!-- Inline Error -->
        @if (errorMessage()) {
          <div class="tb-login-error">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="tb-login-form">
          <div class="tb-form-group">
            <label for="username" class="tb-label">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              [(ngModel)]="username"
              required
              autocomplete="username"
              placeholder="Enter your username"
              class="tb-input"
              [disabled]="loading()"
            />
          </div>

          <div class="tb-form-group">
            <label for="password" class="tb-label">Password</label>
            <div class="tb-password-wrapper">
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                name="password"
                [(ngModel)]="password"
                required
                autocomplete="current-password"
                placeholder="Enter your password"
                class="tb-input"
                [disabled]="loading()"
              />
              <button
                type="button"
                class="tb-toggle-pw"
                (click)="showPassword.set(!showPassword())"
                tabindex="-1"
                [title]="showPassword() ? 'Hide password' : 'Show password'">
                @if (showPassword()) {
                  <!-- Eye Off -->
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                } @else {
                  <!-- Eye -->
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              </button>
            </div>
          </div>

          <div class="tb-form-actions">
            <tb-button
              type="submit"
              variant="primary"
              [loading]="loading()"
              [disabled]="!username || !password || loading()">
              Sign In
            </tb-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .tb-login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-canvas);
      padding: 24px;
    }
    .tb-login-card {
      width: 100%;
      max-width: 400px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card);
      padding: 32px 28px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
    }
    .tb-login-header {
      text-align: center;
      margin-bottom: 24px;
    }
    .tb-wordmark {
      font-size: 20px;
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      letter-spacing: -0.02em;
      margin: 0;
    }
    .tb-subtitle {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin-top: 6px;
    }
    .tb-login-error {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      margin-bottom: 16px;
      background: #FEE2E2;
      border: 1px solid #FECACA;
      border-radius: var(--radius-input);
      color: var(--color-danger);
      font-size: var(--font-size-sm);
    }
    .tb-login-error svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
    .tb-login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .tb-form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .tb-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text);
    }
    .tb-input {
      width: 100%;
      height: 38px;
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
    .tb-password-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .tb-password-wrapper .tb-input {
      padding-right: 38px;
    }
    .tb-toggle-pw {
      position: absolute;
      right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      background: transparent;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      border-radius: 4px;
      transition: color var(--transition);
    }
    .tb-toggle-pw:hover {
      color: var(--color-text);
    }
    .tb-toggle-pw svg {
      width: 18px;
      height: 18px;
    }
    .tb-form-actions {
      margin-top: 8px;
    }
    .tb-form-actions tb-button {
      width: 100%;
      display: block;
    }
    .tb-form-actions ::ng-deep .tb-btn {
      width: 100%;
      justify-content: center;
      height: 38px;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  showPassword = signal(false);
  errorMessage = signal('');
  loading = this.authService.isLoading;

  onSubmit() {
    if (!this.username || !this.password) return;
    this.errorMessage.set('');

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || (err?.status === 401 ? 'Invalid username or password' : 'An error occurred while signing in. Please check your credentials.');
        this.errorMessage.set(msg);
      }
    });
  }
}
