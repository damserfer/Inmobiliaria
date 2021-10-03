import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUsuarioEx, UsuarioEx } from '../usuario-ex.model';
import { UsuarioExService } from '../service/usuario-ex.service';

@Injectable({ providedIn: 'root' })
export class UsuarioExRoutingResolveService implements Resolve<IUsuarioEx> {
  constructor(protected service: UsuarioExService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUsuarioEx> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((usuarioEx: HttpResponse<UsuarioEx>) => {
          if (usuarioEx.body) {
            return of(usuarioEx.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UsuarioEx());
  }
}
