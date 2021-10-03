import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IIngreso, Ingreso } from '../ingreso.model';
import { IngresoService } from '../service/ingreso.service';

@Component({
  selector: 'jhi-ingreso-update',
  templateUrl: './ingreso-update.component.html',
})
export class IngresoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    mes: [],
    concepto: [],
    cantidad: [],
  });

  constructor(protected ingresoService: IngresoService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ingreso }) => {
      this.updateForm(ingreso);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ingreso = this.createFromForm();
    if (ingreso.id !== undefined) {
      this.subscribeToSaveResponse(this.ingresoService.update(ingreso));
    } else {
      this.subscribeToSaveResponse(this.ingresoService.create(ingreso));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIngreso>>): void {
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

  protected updateForm(ingreso: IIngreso): void {
    this.editForm.patchValue({
      id: ingreso.id,
      mes: ingreso.mes,
      concepto: ingreso.concepto,
      cantidad: ingreso.cantidad,
    });
  }

  protected createFromForm(): IIngreso {
    return {
      ...new Ingreso(),
      id: this.editForm.get(['id'])!.value,
      mes: this.editForm.get(['mes'])!.value,
      concepto: this.editForm.get(['concepto'])!.value,
      cantidad: this.editForm.get(['cantidad'])!.value,
    };
  }
}
