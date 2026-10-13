import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(type: Toast['type'], message: string, duration = 4000) {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    this.toasts.update(t => [...t, { id, type, message, duration }]);
    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  success(msg: string) { this.show('success', msg); }
  error(msg: string) { this.show('error', msg); }
  warning(msg: string) { this.show('warning', msg); }
  info(msg: string) { this.show('info', msg); }

  remove(id: string) {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
}
