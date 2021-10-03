import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFotoHabitacion, FotoHabitacion } from '../foto-habitacion.model';
import { FotoHabitacionService } from '../service/foto-habitacion.service';

@Injectable({ providedIn: 'root' })
export class FotoHabitacionRoutingResolveService implements Resolve<IFotoHabitacion> {
  constructor(protected service: FotoHabitacionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFotoHabitacion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fotoHabitacion: HttpResponse<FotoHabitacion>) => {
          if (fotoHabitacion.body) {
            return of(fotoHabitacion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FotoHabitacion());
  }
}
