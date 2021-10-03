import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFotoUsuario } from '../foto-usuario.model';
import { FotoUsuarioService } from '../service/foto-usuario.service';

@Component({
  templateUrl: './foto-usuario-delete-dialog.component.html',
})
export class FotoUsuarioDeleteDialogComponent {
  fotoUsuario?: IFotoUsuario;

  constructor(protected fotoUsuarioService: FotoUsuarioService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fotoUsuarioService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
