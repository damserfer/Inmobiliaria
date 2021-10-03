import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICargo } from '../cargo.model';
import { CargoService } from '../service/cargo.service';

@Component({
  templateUrl: './cargo-delete-dialog.component.html',
})
export class CargoDeleteDialogComponent {
  cargo?: ICargo;

  constructor(protected cargoService: CargoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cargoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
