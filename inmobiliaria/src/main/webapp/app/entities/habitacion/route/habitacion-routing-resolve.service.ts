import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHabitacion, Habitacion } from '../habitacion.model';
import { HabitacionService } from '../service/habitacion.service';

@Injectable({ providedIn: 'root' })
export class HabitacionRoutingResolveService implements Resolve<IHabitacion> {
  constructor(protected service: HabitacionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHabitacion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((habitacion: HttpResponse<Habitacion>) => {
          if (habitacion.body) {
            return of(habitacion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Habitacion());
  }
}
