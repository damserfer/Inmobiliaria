import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UsuarioExComponent } from '../list/usuario-ex.component';
import { UsuarioExDetailComponent } from '../detail/usuario-ex-detail.component';
import { UsuarioExUpdateComponent } from '../update/usuario-ex-update.component';
import { UsuarioExRoutingResolveService } from './usuario-ex-routing-resolve.service';

const usuarioExRoute: Routes = [
  {
    path: '',
    component: UsuarioExComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UsuarioExDetailComponent,
    resolve: {
      usuarioEx: UsuarioExRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UsuarioExUpdateComponent,
    resolve: {
      usuarioEx: UsuarioExRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UsuarioExUpdateComponent,
    resolve: {
      usuarioEx: UsuarioExRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(usuarioExRoute)],
  exports: [RouterModule],
})
export class UsuarioExRoutingModule {}
