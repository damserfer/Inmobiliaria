import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IHabitacion, Habitacion } from '../habitacion.model';
import { HabitacionService } from '../service/habitacion.service';
import { IInmueble } from 'app/entities/inmueble/inmueble.model';
import { InmuebleService } from 'app/entities/inmueble/service/inmueble.service';

@Component({
  selector: 'jhi-habitacion-update',
  templateUrl: './habitacion-update.component.html',
})
export class HabitacionUpdateComponent implements OnInit {
  isSaving = false;

  inmueblesSharedCollection: IInmueble[] = [];

  editForm = this.fb.group({
    id: [],
    precio: [],
    descripcion: [],
    inmueble: [],
  });

  constructor(
    protected habitacionService: HabitacionService,
    protected inmuebleService: InmuebleService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ habitacion }) => {
      this.updateForm(habitacion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const habitacion = this.createFromForm();
    if (habitacion.id !== undefined) {
      this.subscribeToSaveResponse(this.habitacionService.update(habitacion));
    } else {
      this.subscribeToSaveResponse(this.habitacionService.create(habitacion));
    }
  }

  trackInmuebleById(index: number, item: IInmueble): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHabitacion>>): void {
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

  protected updateForm(habitacion: IHabitacion): void {
    this.editForm.patchValue({
      id: habitacion.id,
      precio: habitacion.precio,
      descripcion: habitacion.descripcion,
      inmueble: habitacion.inmueble,
    });

    this.inmueblesSharedCollection = this.inmuebleService.addInmuebleToCollectionIfMissing(
      this.inmueblesSharedCollection,
      habitacion.inmueble
    );
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
  }

  protected createFromForm(): IHabitacion {
    return {
      ...new Habitacion(),
      id: this.editForm.get(['id'])!.value,
      precio: this.editForm.get(['precio'])!.value,
      descripcion: this.editForm.get(['descripcion'])!.value,
      inmueble: this.editForm.get(['inmueble'])!.value,
    };
  }
}
