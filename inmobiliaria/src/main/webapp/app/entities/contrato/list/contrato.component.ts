import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IContrato } from '../contrato.model';
import { ContratoService } from '../service/contrato.service';
import { ContratoDeleteDialogComponent } from '../delete/contrato-delete-dialog.component';

@Component({
  selector: 'jhi-contrato',
  templateUrl: './contrato.component.html',
})
export class ContratoComponent implements OnInit {
  contratoes?: IContrato[];
  isLoading = false;

  constructor(protected contratoService: ContratoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.contratoService.query().subscribe(
      (res: HttpResponse<IContrato[]>) => {
        this.isLoading = false;
        this.contratoes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IContrato): number {
    return item.id!;
  }

  delete(contrato: IContrato): void {
    const modalRef = this.modalService.open(ContratoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.contrato = contrato;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
