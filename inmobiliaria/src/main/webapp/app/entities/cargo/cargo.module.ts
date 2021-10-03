import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { CargoComponent } from './list/cargo.component';
import { CargoDetailComponent } from './detail/cargo-detail.component';
import { CargoUpdateComponent } from './update/cargo-update.component';
import { CargoDeleteDialogComponent } from './delete/cargo-delete-dialog.component';
import { CargoRoutingModule } from './route/cargo-routing.module';

@NgModule({
  imports: [SharedModule, CargoRoutingModule],
  declarations: [CargoComponent, CargoDetailComponent, CargoUpdateComponent, CargoDeleteDialogComponent],
  entryComponents: [CargoDeleteDialogComponent],
})
export class CargoModule {}
