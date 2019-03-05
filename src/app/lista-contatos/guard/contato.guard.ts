import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { DetalhesContatoComponent } from '../detalhes-contato/detalhes-contato.component';
import { Observable } from 'rxjs';

@Injectable()
export class ContatoGuard implements CanDeactivate<DetalhesContatoComponent> {

  canDeactivate(
    component: DetalhesContatoComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if (component.editandoContato) {
      return confirm('Você ainda está editando. Deseja realmente sair?');
    }
    return true;
  }

  constructor() { }

}
