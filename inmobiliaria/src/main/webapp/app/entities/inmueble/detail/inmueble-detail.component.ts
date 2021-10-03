import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInmueble } from '../inmueble.model';

@Component({
  selector: 'jhi-inmueble-detail',
  templateUrl: './inmueble-detail.component.html',
})
export class InmuebleDetailComponent implements OnInit {
  inmueble: IInmueble | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ inmueble }) => {
      this.inmueble = inmueble;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
