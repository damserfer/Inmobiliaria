import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CargoComponent } from '../list/cargo.component';
import { CargoDetailComponent } from '../detail/cargo-detail.component';
import { CargoUpdateComponent } from '../update/cargo-update.component';
import { CargoRoutingResolveService } from './cargo-routing-resolve.service';

const cargoRoute: Routes = [
  {
    path: '',
    component: CargoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CargoDetailComponent,
    resolve: {
      cargo: CargoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CargoUpdateComponent,
    resolve: {
      cargo: CargoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CargoUpdateComponent,
    resolve: {
      cargo: CargoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cargoRoute)],
  exports: [RouterModule],
})
export class CargoRoutingModule {}
