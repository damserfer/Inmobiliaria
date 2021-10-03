import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIngreso, Ingreso } from '../ingreso.model';
import { IngresoService } from '../service/ingreso.service';

@Injectable({ providedIn: 'root' })
export class IngresoRoutingResolveService implements Resolve<IIngreso> {
  constructor(protected service: IngresoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIngreso> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ingreso: HttpResponse<Ingreso>) => {
          if (ingreso.body) {
            return of(ingreso.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Ingreso());
  }
}
