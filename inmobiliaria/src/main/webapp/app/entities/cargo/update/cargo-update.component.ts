import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICargo, Cargo } from '../cargo.model';
import { CargoService } from '../service/cargo.service';
import { IIngreso } from 'app/entities/ingreso/ingreso.model';
import { IngresoService } from 'app/entities/ingreso/service/ingreso.service';
import { IContrato } from 'app/entities/contrato/contrato.model';
import { ContratoService } from 'app/entities/contrato/service/contrato.service';

@Component({
  selector: 'jhi-cargo-update',
  templateUrl: './cargo-update.component.html',
})
export class CargoUpdateComponent implements OnInit {
  isSaving = false;

  ingresosCollection: IIngreso[] = [];
  contratoesSharedCollection: IContrato[] = [];

  editForm = this.fb.group({
    id: [],
    fechaCargo: [],
    mes: [],
    ejercicio: [],
    importeTotal: [],
    pagado: [],
    concepto: [],
    ingreso: [],
    contrato: [],
  });

  constructor(
    protected cargoService: CargoService,
    protected ingresoService: IngresoService,
    protected contratoService: ContratoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cargo }) => {
      this.updateForm(cargo);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cargo = this.createFromForm();
    if (cargo.id !== undefined) {
      this.subscribeToSaveResponse(this.cargoService.update(cargo));
    } else {
      this.subscribeToSaveResponse(this.cargoService.create(cargo));
    }
  }

  trackIngresoById(index: number, item: IIngreso): number {
    return item.id!;
  }

  trackContratoById(index: number, item: IContrato): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICargo>>): void {
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

  protected updateForm(cargo: ICargo): void {
    this.editForm.patchValue({
      id: cargo.id,
      fechaCargo: cargo.fechaCargo,
      mes: cargo.mes,
      ejercicio: cargo.ejercicio,
      importeTotal: cargo.importeTotal,
      pagado: cargo.pagado,
      concepto: cargo.concepto,
      ingreso: cargo.ingreso,
      contrato: cargo.contrato,
    });

    this.ingresosCollection = this.ingresoService.addIngresoToCollectionIfMissing(this.ingresosCollection, cargo.ingreso);
    this.contratoesSharedCollection = this.contratoService.addContratoToCollectionIfMissing(
      this.contratoesSharedCollection,
      cargo.contrato
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ingresoService
      .query({ filter: 'cargo-is-null' })
      .pipe(map((res: HttpResponse<IIngreso[]>) => res.body ?? []))
      .pipe(
        map((ingresos: IIngreso[]) => this.ingresoService.addIngresoToCollectionIfMissing(ingresos, this.editForm.get('ingreso')!.value))
      )
      .subscribe((ingresos: IIngreso[]) => (this.ingresosCollection = ingresos));

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

  protected createFromForm(): ICargo {
    return {
      ...new Cargo(),
      id: this.editForm.get(['id'])!.value,
      fechaCargo: this.editForm.get(['fechaCargo'])!.value,
      mes: this.editForm.get(['mes'])!.value,
      ejercicio: this.editForm.get(['ejercicio'])!.value,
      importeTotal: this.editForm.get(['importeTotal'])!.value,
      pagado: this.editForm.get(['pagado'])!.value,
      concepto: this.editForm.get(['concepto'])!.value,
      ingreso: this.editForm.get(['ingreso'])!.value,
      contrato: this.editForm.get(['contrato'])!.value,
    };
  }
}
