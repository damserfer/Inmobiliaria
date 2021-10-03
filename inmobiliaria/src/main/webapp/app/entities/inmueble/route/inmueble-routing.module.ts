import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InmuebleComponent } from '../list/inmueble.component';
import { InmuebleDetailComponent } from '../detail/inmueble-detail.component';
import { InmuebleUpdateComponent } from '../update/inmueble-update.component';
import { InmuebleRoutingResolveService } from './inmueble-routing-resolve.service';

const inmuebleRoute: Routes = [
  {
    path: '',
    component: InmuebleComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InmuebleDetailComponent,
    resolve: {
      inmueble: InmuebleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InmuebleUpdateComponent,
    resolve: {
      inmueble: InmuebleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InmuebleUpdateComponent,
    resolve: {
      inmueble: InmuebleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(inmuebleRoute)],
  exports: [RouterModule],
})
export class InmuebleRoutingModule {}
