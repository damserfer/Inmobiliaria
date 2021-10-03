import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFotoUsuario, FotoUsuario } from '../foto-usuario.model';
import { FotoUsuarioService } from '../service/foto-usuario.service';

@Injectable({ providedIn: 'root' })
export class FotoUsuarioRoutingResolveService implements Resolve<IFotoUsuario> {
  constructor(protected service: FotoUsuarioService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFotoUsuario> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fotoUsuario: HttpResponse<FotoUsuario>) => {
          if (fotoUsuario.body) {
            return of(fotoUsuario.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FotoUsuario());
  }
}
