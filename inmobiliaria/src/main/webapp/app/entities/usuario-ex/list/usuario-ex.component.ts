import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUsuarioEx } from '../usuario-ex.model';
import { UsuarioExService } from '../service/usuario-ex.service';
import { UsuarioExDeleteDialogComponent } from '../delete/usuario-ex-delete-dialog.component';

@Component({
  selector: 'jhi-usuario-ex',
  templateUrl: './usuario-ex.component.html',
})
export class UsuarioExComponent implements OnInit {
  usuarioExes?: IUsuarioEx[];
  isLoading = false;

  constructor(protected usuarioExService: UsuarioExService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.usuarioExService.query().subscribe(
      (res: HttpResponse<IUsuarioEx[]>) => {
        this.isLoading = false;
        this.usuarioExes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IUsuarioEx): number {
    return item.id!;
  }

  delete(usuarioEx: IUsuarioEx): void {
    const modalRef = this.modalService.open(UsuarioExDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.usuarioEx = usuarioEx;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
