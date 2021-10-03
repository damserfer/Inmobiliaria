import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FotoHabitacionComponent } from './list/foto-habitacion.component';
import { FotoHabitacionDetailComponent } from './detail/foto-habitacion-detail.component';
import { FotoHabitacionUpdateComponent } from './update/foto-habitacion-update.component';
import { FotoHabitacionDeleteDialogComponent } from './delete/foto-habitacion-delete-dialog.component';
import { FotoHabitacionRoutingModule } from './route/foto-habitacion-routing.module';

@NgModule({
  imports: [SharedModule, FotoHabitacionRoutingModule],
  declarations: [
    FotoHabitacionComponent,
    FotoHabitacionDetailComponent,
    FotoHabitacionUpdateComponent,
    FotoHabitacionDeleteDialogComponent,
  ],
  entryComponents: [FotoHabitacionDeleteDialogComponent],
})
export class FotoHabitacionModule {}
