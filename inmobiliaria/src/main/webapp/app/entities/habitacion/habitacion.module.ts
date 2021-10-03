import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { HabitacionComponent } from './list/habitacion.component';
import { HabitacionDetailComponent } from './detail/habitacion-detail.component';
import { HabitacionUpdateComponent } from './update/habitacion-update.component';
import { HabitacionDeleteDialogComponent } from './delete/habitacion-delete-dialog.component';
import { HabitacionRoutingModule } from './route/habitacion-routing.module';

@NgModule({
  imports: [SharedModule, HabitacionRoutingModule],
  declarations: [HabitacionComponent, HabitacionDetailComponent, HabitacionUpdateComponent, HabitacionDeleteDialogComponent],
  entryComponents: [HabitacionDeleteDialogComponent],
})
export class HabitacionModule {}
