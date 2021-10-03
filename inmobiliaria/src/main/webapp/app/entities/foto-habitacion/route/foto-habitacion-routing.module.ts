import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FotoHabitacionComponent } from '../list/foto-habitacion.component';
import { FotoHabitacionDetailComponent } from '../detail/foto-habitacion-detail.component';
import { FotoHabitacionUpdateComponent } from '../update/foto-habitacion-update.component';
import { FotoHabitacionRoutingResolveService } from './foto-habitacion-routing-resolve.service';

const fotoHabitacionRoute: Routes = [
  {
    path: '',
    component: FotoHabitacionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FotoHabitacionDetailComponent,
    resolve: {
      fotoHabitacion: FotoHabitacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FotoHabitacionUpdateComponent,
    resolve: {
      fotoHabitacion: FotoHabitacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FotoHabitacionUpdateComponent,
    resolve: {
      fotoHabitacion: FotoHabitacionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fotoHabitacionRoute)],
  exports: [RouterModule],
})
export class FotoHabitacionRoutingModule {}
