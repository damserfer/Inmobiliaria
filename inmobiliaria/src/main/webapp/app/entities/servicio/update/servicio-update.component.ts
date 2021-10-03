import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IServicio, Servicio } from '../servicio.model';
import { ServicioService } from '../service/servicio.service';
import { IInmueble } from 'app/entities/inmueble/inmueble.model';
import { InmuebleService } from 'app/entities/inmueble/service/inmueble.service';
import { IEmpresa } from 'app/entities/empresa/empresa.model';
import { EmpresaService } from 'app/entities/empresa/service/empresa.service';

@Component({
  selector: 'jhi-servicio-update',
  templateUrl: './servicio-update.component.html',
})
export class ServicioUpdateComponent implements OnInit {
  isSaving = false;

  inmueblesSharedCollection: IInmueble[] = [];
  empresasSharedCollection: IEmpresa[] = [];

  editForm = this.fb.group({
    id: [],
    nombre: [],
    precioHoras: [],
    horas: [],
    inmueble: [],
    empresa: [],
  });

  constructor(
    protected servicioService: ServicioService,
    protected inmuebleService: InmuebleService,
    protected empresaService: EmpresaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ servicio }) => {
      this.updateForm(servicio);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const servicio = this.createFromForm();
    if (servicio.id !== undefined) {
      this.subscribeToSaveResponse(this.servicioService.update(servicio));
    } else {
      this.subscribeToSaveResponse(this.servicioService.create(servicio));
    }
  }

  trackInmuebleById(index: number, item: IInmueble): number {
    return item.id!;
  }

  trackEmpresaById(index: number, item: IEmpresa): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IServicio>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(servicio: IServicio): void {
    this.editForm.patchValue({
      id: servicio.id,
      nombre: servicio.nombre,
      precioHoras: servicio.precioHoras,
      horas: servicio.horas,
      inmueble: servicio.inmueble,
      empresa: servicio.empresa,
    });

    this.inmueblesSharedCollection = this.inmuebleService.addInmuebleToCollectionIfMissing(
      this.inmueblesSharedCollection,
      servicio.inmueble
    );
    this.empresasSharedCollection = this.empresaService.addEmpresaToCollectionIfMissing(this.empresasSharedCollection, servicio.empresa);
  }

  protected loadRelationshipsOptions(): void {
    this.inmuebleService
      .query()
      .pipe(map((res: HttpResponse<IInmueble[]>) => res.body ?? []))
      .pipe(
        map((inmuebles: IInmueble[]) =>
          this.inmuebleService.addInmuebleToCollectionIfMissing(inmuebles, this.editForm.get('inmueble')!.value)
        )
      )
      .subscribe((inmuebles: IInmueble[]) => (this.inmueblesSharedCollection = inmuebles));

    this.empresaService
      .query()
      .pipe(map((res: HttpResponse<IEmpresa[]>) => res.body ?? []))
      .pipe(
        map((empresas: IEmpresa[]) => this.empresaService.addEmpresaToCollectionIfMissing(empresas, this.editForm.get('empresa')!.value))
      )
      .subscribe((empresas: IEmpresa[]) => (this.empresasSharedCollection = empresas));
  }

  protected createFromForm(): IServicio {
    return {
      ...new Servicio(),
      id: this.editForm.get(['id'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      precioHoras: this.editForm.get(['precioHoras'])!.value,
      horas: this.editForm.get(['horas'])!.value,
      inmueble: this.editForm.get(['inmueble'])!.value,
      empresa: this.editForm.get(['empresa'])!.value,
    };
  }
}
