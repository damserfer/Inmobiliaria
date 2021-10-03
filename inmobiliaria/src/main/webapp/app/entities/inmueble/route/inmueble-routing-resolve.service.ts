import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInmueble, Inmueble } from '../inmueble.model';
import { InmuebleService } from '../service/inmueble.service';

@Injectable({ providedIn: 'root' })
export class InmuebleRoutingResolveService implements Resolve<IInmueble> {
  constructor(protected service: InmuebleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInmueble> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((inmueble: HttpResponse<Inmueble>) => {
          if (inmueble.body) {
            return of(inmueble.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Inmueble());
  }
}
