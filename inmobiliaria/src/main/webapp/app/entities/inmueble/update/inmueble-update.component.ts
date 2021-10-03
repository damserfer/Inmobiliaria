import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IInmueble, Inmueble } from '../inmueble.model';
import { InmuebleService } from '../service/inmueble.service';
import { IUsuarioEx } from 'app/entities/usuario-ex/usuario-ex.model';
import { UsuarioExService } from 'app/entities/usuario-ex/service/usuario-ex.service';

@Component({
  selector: 'jhi-inmueble-update',
  templateUrl: './inmueble-update.component.html',
})
export class InmuebleUpdateComponent implements OnInit {
  isSaving = false;

  usuarioExesSharedCollection: IUsuarioEx[] = [];

  editForm = this.fb.group({
    id: [],
    calle: [],
    numero: [],
    escalera: [],
    codPostal: [],
    ciudad: [],
    descripcion: [],
    nbanios: [],
    usuarioEx: [],
  });

  constructor(
    protected inmuebleService: InmuebleService,
    protected usuarioExService: UsuarioExService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ inmueble }) => {
      this.updateForm(inmueble);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const inmueble = this.createFromForm();
    if (inmueble.id !== undefined) {
      this.subscribeToSaveResponse(this.inmuebleService.update(inmueble));
    } else {
      this.subscribeToSaveResponse(this.inmuebleService.create(inmueble));
    }
  }

  trackUsuarioExById(index: number, item: IUsuarioEx): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInmueble>>): void {
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

  protected updateForm(inmueble: IInmueble): void {
    this.editForm.patchValue({
      id: inmueble.id,
      calle: inmueble.calle,
      numero: inmueble.numero,
      escalera: inmueble.escalera,
      codPostal: inmueble.codPostal,
      ciudad: inmueble.ciudad,
      descripcion: inmueble.descripcion,
      nbanios: inmueble.nbanios,
      usuarioEx: inmueble.usuarioEx,
    });

    this.usuarioExesSharedCollection = this.usuarioExService.addUsuarioExToCollectionIfMissing(
      this.usuarioExesSharedCollection,
      inmueble.usuarioEx
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
  }

  protected createFromForm(): IInmueble {
    return {
      ...new Inmueble(),
      id: this.editForm.get(['id'])!.value,
      calle: this.editForm.get(['calle'])!.value,
      numero: this.editForm.get(['numero'])!.value,
      escalera: this.editForm.get(['escalera'])!.value,
      codPostal: this.editForm.get(['codPostal'])!.value,
      ciudad: this.editForm.get(['ciudad'])!.value,
      descripcion: this.editForm.get(['descripcion'])!.value,
      nbanios: this.editForm.get(['nbanios'])!.value,
      usuarioEx: this.editForm.get(['usuarioEx'])!.value,
    };
  }
}
