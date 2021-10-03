import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IIngreso } from '../ingreso.model';
import { IngresoService } from '../service/ingreso.service';

@Component({
  templateUrl: './ingreso-delete-dialog.component.html',
})
export class IngresoDeleteDialogComponent {
  ingreso?: IIngreso;

  constructor(protected ingresoService: IngresoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ingresoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
