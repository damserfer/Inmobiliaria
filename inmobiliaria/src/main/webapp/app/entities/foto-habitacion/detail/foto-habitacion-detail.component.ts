import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFotoHabitacion } from '../foto-habitacion.model';

@Component({
  selector: 'jhi-foto-habitacion-detail',
  templateUrl: './foto-habitacion-detail.component.html',
})
export class FotoHabitacionDetailComponent implements OnInit {
  fotoHabitacion: IFotoHabitacion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fotoHabitacion }) => {
      this.fotoHabitacion = fotoHabitacion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
