import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { IngresoComponent } from './list/ingreso.component';
import { IngresoDetailComponent } from './detail/ingreso-detail.component';
import { IngresoUpdateComponent } from './update/ingreso-update.component';
import { IngresoDeleteDialogComponent } from './delete/ingreso-delete-dialog.component';
import { IngresoRoutingModule } from './route/ingreso-routing.module';

@NgModule({
  imports: [SharedModule, IngresoRoutingModule],
  declarations: [IngresoComponent, IngresoDetailComponent, IngresoUpdateComponent, IngresoDeleteDialogComponent],
  entryComponents: [IngresoDeleteDialogComponent],
})
export class IngresoModule {}
