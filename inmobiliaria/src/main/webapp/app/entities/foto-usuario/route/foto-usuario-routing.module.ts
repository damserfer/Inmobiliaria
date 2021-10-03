import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FotoUsuarioComponent } from '../list/foto-usuario.component';
import { FotoUsuarioDetailComponent } from '../detail/foto-usuario-detail.component';
import { FotoUsuarioUpdateComponent } from '../update/foto-usuario-update.component';
import { FotoUsuarioRoutingResolveService } from './foto-usuario-routing-resolve.service';

const fotoUsuarioRoute: Routes = [
  {
    path: '',
    component: FotoUsuarioComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FotoUsuarioDetailComponent,
    resolve: {
      fotoUsuario: FotoUsuarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FotoUsuarioUpdateComponent,
    resolve: {
      fotoUsuario: FotoUsuarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FotoUsuarioUpdateComponent,
    resolve: {
      fotoUsuario: FotoUsuarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fotoUsuarioRoute)],
  exports: [RouterModule],
})
export class FotoUsuarioRoutingModule {}
