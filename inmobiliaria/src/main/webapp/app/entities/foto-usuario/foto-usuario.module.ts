import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FotoUsuarioComponent } from './list/foto-usuario.component';
import { FotoUsuarioDetailComponent } from './detail/foto-usuario-detail.component';
import { FotoUsuarioUpdateComponent } from './update/foto-usuario-update.component';
import { FotoUsuarioDeleteDialogComponent } from './delete/foto-usuario-delete-dialog.component';
import { FotoUsuarioRoutingModule } from './route/foto-usuario-routing.module';

@NgModule({
  imports: [SharedModule, FotoUsuarioRoutingModule],
  declarations: [FotoUsuarioComponent, FotoUsuarioDetailComponent, FotoUsuarioUpdateComponent, FotoUsuarioDeleteDialogComponent],
  entryComponents: [FotoUsuarioDeleteDialogComponent],
})
export class FotoUsuarioModule {}
