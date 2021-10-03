import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFotoUsuario } from '../foto-usuario.model';
import { FotoUsuarioService } from '../service/foto-usuario.service';
import { FotoUsuarioDeleteDialogComponent } from '../delete/foto-usuario-delete-dialog.component';

@Component({
  selector: 'jhi-foto-usuario',
  templateUrl: './foto-usuario.component.html',
})
export class FotoUsuarioComponent implements OnInit {
  fotoUsuarios?: IFotoUsuario[];
  isLoading = false;

  constructor(protected fotoUsuarioService: FotoUsuarioService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.fotoUsuarioService.query().subscribe(
      (res: HttpResponse<IFotoUsuario[]>) => {
        this.isLoading = false;
        this.fotoUsuarios = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFotoUsuario): number {
    return item.id!;
  }

  delete(fotoUsuario: IFotoUsuario): void {
    const modalRef = this.modalService.open(FotoUsuarioDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fotoUsuario = fotoUsuario;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
