import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HabitacionComponent } from '../list/habitacion.component';
import { HabitacionDetailComponent } from '../detail/habitacion-detail.component';
import { HabitacionUpdateComponent } from '../update/habitacion-update.component';
import { HabitacionRoutingResolveService } from './habitacion-routing-resolve.service';

const habitacionRoute: Routes = [
  {
    path: '',
    component: HabitacionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HabitacionDetailComponent,
    resolve: {
      habitacion: HabitacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HabitacionUpdateComponent,
    resolve: {
      habitacion: HabitacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HabitacionUpdateComponent,
    resolve: {
      habitacion: HabitacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(habitacionRoute)],
  exports: [RouterModule],
})
export class HabitacionRoutingModule {}
