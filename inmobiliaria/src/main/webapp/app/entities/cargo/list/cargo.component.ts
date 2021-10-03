import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICargo } from '../cargo.model';
import { CargoService } from '../service/cargo.service';
import { CargoDeleteDialogComponent } from '../delete/cargo-delete-dialog.component';

@Component({
  selector: 'jhi-cargo',
  templateUrl: './cargo.component.html',
})
export class CargoComponent implements OnInit {
  cargos?: ICargo[];
  isLoading = false;

  constructor(protected cargoService: CargoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.cargoService.query().subscribe(
      (res: HttpResponse<ICargo[]>) => {
        this.isLoading = false;
        this.cargos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICargo): number {
    return item.id!;
  }

  delete(cargo: ICargo): void {
    const modalRef = this.modalService.open(CargoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.cargo = cargo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
