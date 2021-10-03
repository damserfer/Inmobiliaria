import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFotoHabitacion } from '../foto-habitacion.model';
import { FotoHabitacionService } from '../service/foto-habitacion.service';

@Component({
  templateUrl: './foto-habitacion-delete-dialog.component.html',
})
export class FotoHabitacionDeleteDialogComponent {
  fotoHabitacion?: IFotoHabitacion;

  constructor(protected fotoHabitacionService: FotoHabitacionService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fotoHabitacionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
