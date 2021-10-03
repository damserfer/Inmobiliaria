import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { UsuarioExComponent } from './list/usuario-ex.component';
import { UsuarioExDetailComponent } from './detail/usuario-ex-detail.component';
import { UsuarioExUpdateComponent } from './update/usuario-ex-update.component';
import { UsuarioExDeleteDialogComponent } from './delete/usuario-ex-delete-dialog.component';
import { UsuarioExRoutingModule } from './route/usuario-ex-routing.module';

@NgModule({
  imports: [SharedModule, UsuarioExRoutingModule],
  declarations: [UsuarioExComponent, UsuarioExDetailComponent, UsuarioExUpdateComponent, UsuarioExDeleteDialogComponent],
  entryComponents: [UsuarioExDeleteDialogComponent],
})
export class UsuarioExModule {}
