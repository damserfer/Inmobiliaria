import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IInmueble } from '../inmueble.model';
import { InmuebleService } from '../service/inmueble.service';
import { InmuebleDeleteDialogComponent } from '../delete/inmueble-delete-dialog.component';

@Component({
  selector: 'jhi-inmueble',
  templateUrl: './inmueble.component.html',
})
export class InmuebleComponent implements OnInit {
  inmuebles?: IInmueble[];
  isLoading = false;

  constructor(protected inmuebleService: InmuebleService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.inmuebleService.query().subscribe(
      (res: HttpResponse<IInmueble[]>) => {
        this.isLoading = false;
        this.inmuebles = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IInmueble): number {
    return item.id!;
  }

  delete(inmueble: IInmueble): void {
    const modalRef = this.modalService.open(InmuebleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.inmueble = inmueble;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
