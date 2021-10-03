import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUsuarioEx } from '../usuario-ex.model';
import { UsuarioExService } from '../service/usuario-ex.service';

@Component({
  templateUrl: './usuario-ex-delete-dialog.component.html',
})
export class UsuarioExDeleteDialogComponent {
  usuarioEx?: IUsuarioEx;

  constructor(protected usuarioExService: UsuarioExService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.usuarioExService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
