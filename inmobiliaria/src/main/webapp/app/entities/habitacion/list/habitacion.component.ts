import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IHabitacion } from '../habitacion.model';
import { HabitacionService } from '../service/habitacion.service';
import { HabitacionDeleteDialogComponent } from '../delete/habitacion-delete-dialog.component';

@Component({
  selector: 'jhi-habitacion',
  templateUrl: './habitacion.component.html',
})
export class HabitacionComponent implements OnInit {
  habitacions?: IHabitacion[];
  isLoading = false;

  constructor(protected habitacionService: HabitacionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.habitacionService.query().subscribe(
      (res: HttpResponse<IHabitacion[]>) => {
        this.isLoading = false;
        this.habitacions = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IHabitacion): number {
    return item.id!;
  }

  delete(habitacion: IHabitacion): void {
    const modalRef = this.modalService.open(HabitacionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.habitacion = habitacion;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
