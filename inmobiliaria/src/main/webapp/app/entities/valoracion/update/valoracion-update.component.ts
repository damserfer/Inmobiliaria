import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IValoracion, Valoracion } from '../valoracion.model';
import { ValoracionService } from '../service/valoracion.service';
import { IContrato } from 'app/entities/contrato/contrato.model';
import { ContratoService } from 'app/entities/contrato/service/contrato.service';

@Component({
  selector: 'jhi-valoracion-update',
  templateUrl: './valoracion-update.component.html',
})
export class ValoracionUpdateComponent implements OnInit {
  isSaving = false;

  contratoesSharedCollection: IContrato[] = [];

  editForm = this.fb.group({
    id: [],
    comentario: [],
    puntuacion: [],
    contrato: [],
  });

  constructor(
    protected valoracionService: ValoracionService,
    protected contratoService: ContratoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ valoracion }) => {
      this.updateForm(valoracion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const valoracion = this.createFromForm();
    if (valoracion.id !== undefined) {
      this.subscribeToSaveResponse(this.valoracionService.update(valoracion));
    } else {
      this.subscribeToSaveResponse(this.valoracionService.create(valoracion));
    }
  }

  trackContratoById(index: number, item: IContrato): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IValoracion>>): void {
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

  protected updateForm(valoracion: IValoracion): void {
    this.editForm.patchValue({
      id: valoracion.id,
      comentario: valoracion.comentario,
      puntuacion: valoracion.puntuacion,
      contrato: valoracion.contrato,
    });

    this.contratoesSharedCollection = this.contratoService.addContratoToCollectionIfMissing(
      this.contratoesSharedCollection,
      valoracion.contrato
    );
  }

  protected loadRelationshipsOptions(): void {
    this.contratoService
      .query()
      .pipe(map((res: HttpResponse<IContrato[]>) => res.body ?? []))
      .pipe(
        map((contratoes: IContrato[]) =>
          this.contratoService.addContratoToCollectionIfMissing(contratoes, this.editForm.get('contrato')!.value)
        )
      )
      .subscribe((contratoes: IContrato[]) => (this.contratoesSharedCollection = contratoes));
  }

  protected createFromForm(): IValoracion {
    return {
      ...new Valoracion(),
      id: this.editForm.get(['id'])!.value,
      comentario: this.editForm.get(['comentario'])!.value,
      puntuacion: this.editForm.get(['puntuacion'])!.value,
      contrato: this.editForm.get(['contrato'])!.value,
    };
  }
}
