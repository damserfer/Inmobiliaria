import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { InmuebleComponent } from './list/inmueble.component';
import { InmuebleDetailComponent } from './detail/inmueble-detail.component';
import { InmuebleUpdateComponent } from './update/inmueble-update.component';
import { InmuebleDeleteDialogComponent } from './delete/inmueble-delete-dialog.component';
import { InmuebleRoutingModule } from './route/inmueble-routing.module';

@NgModule({
  imports: [SharedModule, InmuebleRoutingModule],
  declarations: [InmuebleComponent, InmuebleDetailComponent, InmuebleUpdateComponent, InmuebleDeleteDialogComponent],
  entryComponents: [InmuebleDeleteDialogComponent],
})
export class InmuebleModule {}
