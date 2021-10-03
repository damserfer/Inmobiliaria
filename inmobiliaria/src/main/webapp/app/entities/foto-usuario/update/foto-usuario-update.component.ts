import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IFotoUsuario, FotoUsuario } from '../foto-usuario.model';
import { FotoUsuarioService } from '../service/foto-usuario.service';
import { IUsuarioEx } from 'app/entities/usuario-ex/usuario-ex.model';
import { UsuarioExService } from 'app/entities/usuario-ex/service/usuario-ex.service';

@Component({
  selector: 'jhi-foto-usuario-update',
  templateUrl: './foto-usuario-update.component.html',
})
export class FotoUsuarioUpdateComponent implements OnInit {
  isSaving = false;

  usuarioExesSharedCollection: IUsuarioEx[] = [];

  editForm = this.fb.group({
    id: [],
    url: [],
    usuarioEx: [],
  });

  constructor(
    protected fotoUsuarioService: FotoUsuarioService,
    protected usuarioExService: UsuarioExService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fotoUsuario }) => {
      this.updateForm(fotoUsuario);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fotoUsuario = this.createFromForm();
    if (fotoUsuario.id !== undefined) {
      this.subscribeToSaveResponse(this.fotoUsuarioService.update(fotoUsuario));
    } else {
      this.subscribeToSaveResponse(this.fotoUsuarioService.create(fotoUsuario));
    }
  }

  trackUsuarioExById(index: number, item: IUsuarioEx): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFotoUsuario>>): void {
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

  protected updateForm(fotoUsuario: IFotoUsuario): void {
    this.editForm.patchValue({
      id: fotoUsuario.id,
      url: fotoUsuario.url,
      usuarioEx: fotoUsuario.usuarioEx,
    });

    this.usuarioExesSharedCollection = this.usuarioExService.addUsuarioExToCollectionIfMissing(
      this.usuarioExesSharedCollection,
      fotoUsuario.usuarioEx
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

  protected createFromForm(): IFotoUsuario {
    return {
      ...new FotoUsuario(),
      id: this.editForm.get(['id'])!.value,
      url: this.editForm.get(['url'])!.value,
      usuarioEx: this.editForm.get(['usuarioEx'])!.value,
    };
  }
}
