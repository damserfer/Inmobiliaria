import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IValoracion, Valoracion } from '../valoracion.model';
import { ValoracionService } from '../service/valoracion.service';

@Injectable({ providedIn: 'root' })
export class ValoracionRoutingResolveService implements Resolve<IValoracion> {
  constructor(protected service: ValoracionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IValoracion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((valoracion: HttpResponse<Valoracion>) => {
          if (valoracion.body) {
            return of(valoracion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Valoracion());
  }
}
