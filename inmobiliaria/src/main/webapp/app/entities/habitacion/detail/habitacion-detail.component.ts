import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHabitacion } from '../habitacion.model';

@Component({
  selector: 'jhi-habitacion-detail',
  templateUrl: './habitacion-detail.component.html',
})
export class HabitacionDetailComponent implements OnInit {
  habitacion: IHabitacion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ habitacion }) => {
      this.habitacion = habitacion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
