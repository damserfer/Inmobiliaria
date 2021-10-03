import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUsuarioEx } from '../usuario-ex.model';

@Component({
  selector: 'jhi-usuario-ex-detail',
  templateUrl: './usuario-ex-detail.component.html',
})
export class UsuarioExDetailComponent implements OnInit {
  usuarioEx: IUsuarioEx | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usuarioEx }) => {
      this.usuarioEx = usuarioEx;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
