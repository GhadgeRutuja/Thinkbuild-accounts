import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopBarComponent],
  template: `
    <div class="app-shell" [class.sidebar-collapsed]="collapsed()">
      <app-sidebar [collapsed]="collapsed()" (toggleCollapse)="collapsed.set(!collapsed())" />
      <div class="app-main">
        <app-top-bar [sidebarCollapsed]="collapsed()" />
        <main class="app-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      min-height: 100vh;
      background: var(--color-canvas);
    }
    .app-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      margin-left: var(--sidebar-width);
      transition: margin-left var(--transition);
    }
    .app-shell.sidebar-collapsed .app-main {
      margin-left: var(--sidebar-collapsed);
    }
    .app-content {
      flex: 1;
      padding: 24px;
      overflow: auto;
    }
  `]
})
export class AppLayoutComponent {
  collapsed = signal(false);
}
