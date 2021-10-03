import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFotoUsuario } from '../foto-usuario.model';

@Component({
  selector: 'jhi-foto-usuario-detail',
  templateUrl: './foto-usuario-detail.component.html',
})
export class FotoUsuarioDetailComponent implements OnInit {
  fotoUsuario: IFotoUsuario | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fotoUsuario }) => {
      this.fotoUsuario = fotoUsuario;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
