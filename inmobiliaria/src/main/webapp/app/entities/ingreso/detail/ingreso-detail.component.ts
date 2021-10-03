import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIngreso } from '../ingreso.model';

@Component({
  selector: 'jhi-ingreso-detail',
  templateUrl: './ingreso-detail.component.html',
})
export class IngresoDetailComponent implements OnInit {
  ingreso: IIngreso | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ingreso }) => {
      this.ingreso = ingreso;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
