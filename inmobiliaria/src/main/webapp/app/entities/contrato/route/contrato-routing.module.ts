import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ContratoComponent } from '../list/contrato.component';
import { ContratoDetailComponent } from '../detail/contrato-detail.component';
import { ContratoUpdateComponent } from '../update/contrato-update.component';
import { ContratoRoutingResolveService } from './contrato-routing-resolve.service';

const contratoRoute: Routes = [
  {
    path: '',
    component: ContratoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ContratoDetailComponent,
    resolve: {
      contrato: ContratoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ContratoUpdateComponent,
    resolve: {
      contrato: ContratoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ContratoUpdateComponent,
    resolve: {
      contrato: ContratoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(contratoRoute)],
  exports: [RouterModule],
})
export class ContratoRoutingModule {}
