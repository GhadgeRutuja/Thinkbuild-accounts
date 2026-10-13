import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, EMPTY, of, delay, throwError, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthState, UserInfo, Permission, Module, Action, MODULES } from '../models/user.model';

/** Mock users matching the backend DataSeeder exactly */
const MOCK_USERS: Array<{ username: string; password: string; user: UserInfo; role: string }> = [
  { username: 'admin', password: 'Admin@123', role: 'Admin', user: { id: 1, username: 'admin', fullName: 'System Administrator', email: 'admin@thinkbuild.com', role: 'Admin' } },
  { username: 'accountant1', password: 'Accountant@123', role: 'Accountant', user: { id: 2, username: 'accountant1', fullName: 'Accountant User', email: 'accountant@thinkbuild.com', role: 'Accountant' } },
  { username: 'storekeeper1', password: 'StoreKeeper@123', role: 'Store Keeper', user: { id: 3, username: 'storekeeper1', fullName: 'Store Keeper User', email: 'storekeeper@thinkbuild.com', role: 'Store Keeper' } },
  { username: 'sales1', password: 'Sales@123', role: 'Sales', user: { id: 4, username: 'sales1', fullName: 'Sales User', email: 'sales@thinkbuild.com', role: 'Sales' } },
  { username: 'cashier1', password: 'Cashier@123', role: 'Cashier', user: { id: 5, username: 'cashier1', fullName: 'Cashier User', email: 'cashier@thinkbuild.com', role: 'Cashier' } },
  { username: 'viewer1', password: 'Viewer@123', role: 'Viewer', user: { id: 6, username: 'viewer1', fullName: 'Viewer User', email: 'viewer@thinkbuild.com', role: 'Viewer' } }
];

function allPermissions(): Permission {
  return { canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true, canPrint: true };
}

function viewOnly(): Permission {
  return { canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false, canPrint: false };
}

function buildMockPermissions(role: string): Record<string, Permission> {
  const perms: Record<string, Permission> = {};
  for (const mod of MODULES) {
    if (role === 'Admin') {
      perms[mod] = allPermissions();
    } else if (role === 'Viewer') {
      perms[mod] = viewOnly();
    } else {
      perms[mod] = { canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: false, canPrint: true };
    }
  }
  return perms;
}

function generateMockToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = 'mock_';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private state = signal<AuthState>({
    user: null,
    permissions: {},
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken')
  });

  readonly user = computed(() => this.state().user);
  readonly isAuthenticated = computed(() => !!this.state().accessToken && !!this.state().user);
  readonly isLoading = signal(false);
  readonly permissions = computed(() => this.state().permissions);
  readonly accessToken = computed(() => this.state().accessToken);
  readonly refreshToken = computed(() => this.state().refreshToken);

  constructor() {
    // On startup, restore user from localStorage if we have tokens (mock mode)
    if ((environment as any).useMockAuth && this.state().accessToken) {
      const savedUser = localStorage.getItem('mockUser');
      const savedPermissions = localStorage.getItem('mockPermissions');
      if (savedUser && savedPermissions) {
        this.state.update(s => ({
          ...s,
          user: JSON.parse(savedUser),
          permissions: JSON.parse(savedPermissions)
        }));
      }
    }
  }

  login(username: string, password: string) {
    if ((environment as any).useMockAuth) {
      return this.mockLogin(username, password);
    }

    this.isLoading.set(true);
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap(res => {
        this.setTokens(res.accessToken, res.refreshToken);
        this.state.update(s => ({ ...s, user: res.user, permissions: res.permissions }));
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.isLoading.set(false);
        throw err;
      })
    );
  }

  private mockLogin(username: string, password: string) {
    this.isLoading.set(true);

    const mockUser = MOCK_USERS.find(u => u.username === username);

    // Simulate a small network delay
    return of(null).pipe(
      delay(500),
      switchMap(() => {
        if (!mockUser || mockUser.password !== password) {
          this.isLoading.set(false);
          return throwError(() => ({ status: 401, error: { message: 'Invalid username or password' } }));
        }

        const accessToken = generateMockToken();
        const refreshToken = generateMockToken();
        const permissions = buildMockPermissions(mockUser.role);

        this.setTokens(accessToken, refreshToken);
        localStorage.setItem('mockUser', JSON.stringify(mockUser.user));
        localStorage.setItem('mockPermissions', JSON.stringify(permissions));
        this.state.update(s => ({ ...s, user: mockUser.user, permissions }));
        this.isLoading.set(false);

        return of({ accessToken, refreshToken, user: mockUser.user, permissions });
      })
    );
  }

  logout() {
    if (!(environment as any).useMockAuth) {
      const refreshToken = this.state().refreshToken;
      if (refreshToken) {
        this.http.post(`${environment.apiUrl}/auth/logout`, { refreshToken }).subscribe({
          error: () => {}
        });
      }
    }
    this.clearState();
    this.router.navigate(['/login']);
  }

  refreshTokens() {
    if ((environment as any).useMockAuth) {
      // Mock: just generate new tokens
      const newAccess = generateMockToken();
      const newRefresh = generateMockToken();
      this.setTokens(newAccess, newRefresh);
      return of({ accessToken: newAccess, refreshToken: newRefresh });
    }

    const refreshToken = this.state().refreshToken;
    if (!refreshToken) return EMPTY;
    return this.http.post<any>(`${environment.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap(res => this.setTokens(res.accessToken, res.refreshToken)),
      catchError(() => {
        this.clearState();
        this.router.navigate(['/login']);
        return EMPTY;
      })
    );
  }

  loadMe() {
    if ((environment as any).useMockAuth) {
      // Mock: user is already in state from constructor or login
      return of({ user: this.state().user, permissions: this.state().permissions });
    }

    return this.http.get<any>(`${environment.apiUrl}/auth/me`).pipe(
      tap(res => this.state.update(s => ({ ...s, user: res.user, permissions: res.permissions })))
    );
  }

  can(module: string, action: Action): boolean {
    const u = this.state().user;
    if (u && (u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' || u.role === 'admin' || u.role === 'Admin')) {
      return true;
    }
    const perm = this.state().permissions[module];
    if (!perm) return false;
    switch (action) {
      case 'VIEW': return perm.canView;
      case 'CREATE': return perm.canCreate;
      case 'EDIT': return perm.canEdit;
      case 'DELETE': return perm.canDelete;
      case 'APPROVE': return perm.canApprove;
      case 'PRINT': return perm.canPrint;
      default: return false;
    }
  }

  private setTokens(access: string, refresh: string) {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    this.state.update(s => ({ ...s, accessToken: access, refreshToken: refresh }));
  }

  private clearState() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockPermissions');
    this.state.set({ user: null, permissions: {}, accessToken: null, refreshToken: null });
  }
}
