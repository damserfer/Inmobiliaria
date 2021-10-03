import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICargo } from '../cargo.model';

@Component({
  selector: 'jhi-cargo-detail',
  templateUrl: './cargo-detail.component.html',
})
export class CargoDetailComponent implements OnInit {
  cargo: ICargo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cargo }) => {
      this.cargo = cargo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
