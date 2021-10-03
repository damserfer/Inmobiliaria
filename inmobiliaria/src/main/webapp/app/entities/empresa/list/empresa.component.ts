import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmpresa } from '../empresa.model';
import { EmpresaService } from '../service/empresa.service';
import { EmpresaDeleteDialogComponent } from '../delete/empresa-delete-dialog.component';

@Component({
  selector: 'jhi-empresa',
  templateUrl: './empresa.component.html',
})
export class EmpresaComponent implements OnInit {
  empresas?: IEmpresa[];
  isLoading = false;

  constructor(protected empresaService: EmpresaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.empresaService.query().subscribe(
      (res: HttpResponse<IEmpresa[]>) => {
        this.isLoading = false;
        this.empresas = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEmpresa): number {
    return item.id!;
  }

  delete(empresa: IEmpresa): void {
    const modalRef = this.modalService.open(EmpresaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.empresa = empresa;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
