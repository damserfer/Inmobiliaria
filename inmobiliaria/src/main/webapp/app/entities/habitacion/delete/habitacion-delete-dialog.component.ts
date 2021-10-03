import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHabitacion } from '../habitacion.model';
import { HabitacionService } from '../service/habitacion.service';

@Component({
  templateUrl: './habitacion-delete-dialog.component.html',
})
export class HabitacionDeleteDialogComponent {
  habitacion?: IHabitacion;

  constructor(protected habitacionService: HabitacionService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.habitacionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
