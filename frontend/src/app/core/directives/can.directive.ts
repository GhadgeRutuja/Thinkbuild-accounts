import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Action } from '../models/user.model';

@Directive({
  selector: '[can]',
  standalone: true
})
export class CanDirective implements OnInit {
  @Input('can') permission!: string; // format: 'MODULE,ACTION'
  private tpl = inject(TemplateRef<unknown>);
  private vcr = inject(ViewContainerRef);
  private auth = inject(AuthService);

  ngOnInit() {
    if (!this.permission) {
      return;
    }
    const [module, action] = this.permission.split(',').map(s => s.trim());
    if (this.auth.can(module, action as Action)) {
      this.vcr.createEmbeddedView(this.tpl);
    } else {
      this.vcr.clear();
    }
  }
}
