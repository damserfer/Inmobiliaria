import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IUsuarioEx, UsuarioEx } from '../usuario-ex.model';
import { UsuarioExService } from '../service/usuario-ex.service';

@Component({
  selector: 'jhi-usuario-ex-update',
  templateUrl: './usuario-ex-update.component.html',
})
export class UsuarioExUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    dni: [],
    nombre: [],
    apellidos: [],
    password: [],
  });

  constructor(protected usuarioExService: UsuarioExService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usuarioEx }) => {
      this.updateForm(usuarioEx);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const usuarioEx = this.createFromForm();
    if (usuarioEx.id !== undefined) {
      this.subscribeToSaveResponse(this.usuarioExService.update(usuarioEx));
    } else {
      this.subscribeToSaveResponse(this.usuarioExService.create(usuarioEx));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUsuarioEx>>): void {
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

  protected updateForm(usuarioEx: IUsuarioEx): void {
    this.editForm.patchValue({
      id: usuarioEx.id,
      dni: usuarioEx.dni,
      nombre: usuarioEx.nombre,
      apellidos: usuarioEx.apellidos,
      password: usuarioEx.password,
    });
  }

  protected createFromForm(): IUsuarioEx {
    return {
      ...new UsuarioEx(),
      id: this.editForm.get(['id'])!.value,
      dni: this.editForm.get(['dni'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      apellidos: this.editForm.get(['apellidos'])!.value,
      password: this.editForm.get(['password'])!.value,
    };
  }
}
