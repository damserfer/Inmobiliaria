import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IContrato, Contrato } from '../contrato.model';
import { ContratoService } from '../service/contrato.service';
import { IUsuarioEx } from 'app/entities/usuario-ex/usuario-ex.model';
import { UsuarioExService } from 'app/entities/usuario-ex/service/usuario-ex.service';
import { IInmueble } from 'app/entities/inmueble/inmueble.model';
import { InmuebleService } from 'app/entities/inmueble/service/inmueble.service';

@Component({
  selector: 'jhi-contrato-update',
  templateUrl: './contrato-update.component.html',
})
export class ContratoUpdateComponent implements OnInit {
  isSaving = false;

  usuarioExesSharedCollection: IUsuarioEx[] = [];
  inmueblesSharedCollection: IInmueble[] = [];

  editForm = this.fb.group({
    id: [],
    fechaInicio: [],
    fechaFin: [],
    precioAlquiler: [],
    usuarioEx: [],
    inmueble: [],
  });

  constructor(
    protected contratoService: ContratoService,
    protected usuarioExService: UsuarioExService,
    protected inmuebleService: InmuebleService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contrato }) => {
      this.updateForm(contrato);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contrato = this.createFromForm();
    if (contrato.id !== undefined) {
      this.subscribeToSaveResponse(this.contratoService.update(contrato));
    } else {
      this.subscribeToSaveResponse(this.contratoService.create(contrato));
    }
  }

  trackUsuarioExById(index: number, item: IUsuarioEx): number {
    return item.id!;
  }

  trackInmuebleById(index: number, item: IInmueble): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContrato>>): void {
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

  protected updateForm(contrato: IContrato): void {
    this.editForm.patchValue({
      id: contrato.id,
      fechaInicio: contrato.fechaInicio,
      fechaFin: contrato.fechaFin,
      precioAlquiler: contrato.precioAlquiler,
      usuarioEx: contrato.usuarioEx,
      inmueble: contrato.inmueble,
    });

    this.usuarioExesSharedCollection = this.usuarioExService.addUsuarioExToCollectionIfMissing(
      this.usuarioExesSharedCollection,
      contrato.usuarioEx
    );
    this.inmueblesSharedCollection = this.inmuebleService.addInmuebleToCollectionIfMissing(
      this.inmueblesSharedCollection,
      contrato.inmueble
    );
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioExService
      .query()
      .pipe(map((res: HttpResponse<IUsuarioEx[]>) => res.body ?? []))
      .pipe(
        map((usuarioExes: IUsuarioEx[]) =>
          this.usuarioExService.addUsuarioExToCollectionIfMissing(usuarioExes, this.editForm.get('usuarioEx')!.value)
        )
      )
      .subscribe((usuarioExes: IUsuarioEx[]) => (this.usuarioExesSharedCollection = usuarioExes));

    this.inmuebleService
      .query()
      .pipe(map((res: HttpResponse<IInmueble[]>) => res.body ?? []))
      .pipe(
        map((inmuebles: IInmueble[]) =>
          this.inmuebleService.addInmuebleToCollectionIfMissing(inmuebles, this.editForm.get('inmueble')!.value)
        )
      )
      .subscribe((inmuebles: IInmueble[]) => (this.inmueblesSharedCollection = inmuebles));
  }

  protected createFromForm(): IContrato {
    return {
      ...new Contrato(),
      id: this.editForm.get(['id'])!.value,
      fechaInicio: this.editForm.get(['fechaInicio'])!.value,
      fechaFin: this.editForm.get(['fechaFin'])!.value,
      precioAlquiler: this.editForm.get(['precioAlquiler'])!.value,
      usuarioEx: this.editForm.get(['usuarioEx'])!.value,
      inmueble: this.editForm.get(['inmueble'])!.value,
    };
  }
}
