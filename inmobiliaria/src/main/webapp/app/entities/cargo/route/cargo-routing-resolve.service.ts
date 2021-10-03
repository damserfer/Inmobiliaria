import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICargo, Cargo } from '../cargo.model';
import { CargoService } from '../service/cargo.service';

@Injectable({ providedIn: 'root' })
export class CargoRoutingResolveService implements Resolve<ICargo> {
  constructor(protected service: CargoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICargo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((cargo: HttpResponse<Cargo>) => {
          if (cargo.body) {
            return of(cargo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Cargo());
  }
}
