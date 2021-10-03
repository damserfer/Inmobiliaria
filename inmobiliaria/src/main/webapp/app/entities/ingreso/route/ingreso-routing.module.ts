import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { IngresoComponent } from '../list/ingreso.component';
import { IngresoDetailComponent } from '../detail/ingreso-detail.component';
import { IngresoUpdateComponent } from '../update/ingreso-update.component';
import { IngresoRoutingResolveService } from './ingreso-routing-resolve.service';

const ingresoRoute: Routes = [
  {
    path: '',
    component: IngresoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IngresoDetailComponent,
    resolve: {
      ingreso: IngresoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IngresoUpdateComponent,
    resolve: {
      ingreso: IngresoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IngresoUpdateComponent,
    resolve: {
      ingreso: IngresoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ingresoRoute)],
  exports: [RouterModule],
})
export class IngresoRoutingModule {}
