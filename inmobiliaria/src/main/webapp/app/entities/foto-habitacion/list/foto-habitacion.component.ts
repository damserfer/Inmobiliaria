import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFotoHabitacion } from '../foto-habitacion.model';
import { FotoHabitacionService } from '../service/foto-habitacion.service';
import { FotoHabitacionDeleteDialogComponent } from '../delete/foto-habitacion-delete-dialog.component';

@Component({
  selector: 'jhi-foto-habitacion',
  templateUrl: './foto-habitacion.component.html',
})
export class FotoHabitacionComponent implements OnInit {
  fotoHabitacions?: IFotoHabitacion[];
  isLoading = false;

  constructor(protected fotoHabitacionService: FotoHabitacionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.fotoHabitacionService.query().subscribe(
      (res: HttpResponse<IFotoHabitacion[]>) => {
        this.isLoading = false;
        this.fotoHabitacions = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFotoHabitacion): number {
    return item.id!;
  }

  delete(fotoHabitacion: IFotoHabitacion): void {
    const modalRef = this.modalService.open(FotoHabitacionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fotoHabitacion = fotoHabitacion;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
