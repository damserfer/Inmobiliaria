import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInmueble } from '../inmueble.model';
import { InmuebleService } from '../service/inmueble.service';

@Component({
  templateUrl: './inmueble-delete-dialog.component.html',
})
export class InmuebleDeleteDialogComponent {
  inmueble?: IInmueble;

  constructor(protected inmuebleService: InmuebleService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.inmuebleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
