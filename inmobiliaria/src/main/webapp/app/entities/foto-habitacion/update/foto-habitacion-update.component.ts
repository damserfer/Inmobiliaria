import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFotoHabitacion, FotoHabitacion } from '../foto-habitacion.model';
import { FotoHabitacionService } from '../service/foto-habitacion.service';
import { IHabitacion } from 'app/entities/habitacion/habitacion.model';
import { HabitacionService } from 'app/entities/habitacion/service/habitacion.service';

@Component({
  selector: 'jhi-foto-habitacion-update',
  templateUrl: './foto-habitacion-update.component.html',
})
export class FotoHabitacionUpdateComponent implements OnInit {
  isSaving = false;

  habitacionsSharedCollection: IHabitacion[] = [];

  editForm = this.fb.group({
    id: [],
    url: [],
    habitacion: [],
  });

  constructor(
    protected fotoHabitacionService: FotoHabitacionService,
    protected habitacionService: HabitacionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fotoHabitacion }) => {
      this.updateForm(fotoHabitacion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fotoHabitacion = this.createFromForm();
    if (fotoHabitacion.id !== undefined) {
      this.subscribeToSaveResponse(this.fotoHabitacionService.update(fotoHabitacion));
    } else {
      this.subscribeToSaveResponse(this.fotoHabitacionService.create(fotoHabitacion));
    }
  }

  trackHabitacionById(index: number, item: IHabitacion): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFotoHabitacion>>): void {
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

  protected updateForm(fotoHabitacion: IFotoHabitacion): void {
    this.editForm.patchValue({
      id: fotoHabitacion.id,
      url: fotoHabitacion.url,
      habitacion: fotoHabitacion.habitacion,
    });

    this.habitacionsSharedCollection = this.habitacionService.addHabitacionToCollectionIfMissing(
      this.habitacionsSharedCollection,
      fotoHabitacion.habitacion
    );
  }

  protected loadRelationshipsOptions(): void {
    this.habitacionService
      .query()
      .pipe(map((res: HttpResponse<IHabitacion[]>) => res.body ?? []))
      .pipe(
        map((habitacions: IHabitacion[]) =>
          this.habitacionService.addHabitacionToCollectionIfMissing(habitacions, this.editForm.get('habitacion')!.value)
        )
      )
      .subscribe((habitacions: IHabitacion[]) => (this.habitacionsSharedCollection = habitacions));
  }

  protected createFromForm(): IFotoHabitacion {
    return {
      ...new FotoHabitacion(),
      id: this.editForm.get(['id'])!.value,
      url: this.editForm.get(['url'])!.value,
      habitacion: this.editForm.get(['habitacion'])!.value,
    };
  }
}
