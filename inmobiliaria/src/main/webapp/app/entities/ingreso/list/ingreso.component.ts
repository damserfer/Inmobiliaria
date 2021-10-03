import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IIngreso } from '../ingreso.model';
import { IngresoService } from '../service/ingreso.service';
import { IngresoDeleteDialogComponent } from '../delete/ingreso-delete-dialog.component';

@Component({
  selector: 'jhi-ingreso',
  templateUrl: './ingreso.component.html',
})
export class IngresoComponent implements OnInit {
  ingresos?: IIngreso[];
  isLoading = false;

  constructor(protected ingresoService: IngresoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.ingresoService.query().subscribe(
      (res: HttpResponse<IIngreso[]>) => {
        this.isLoading = false;
        this.ingresos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IIngreso): number {
    return item.id!;
  }

  delete(ingreso: IIngreso): void {
    const modalRef = this.modalService.open(IngresoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ingreso = ingreso;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
