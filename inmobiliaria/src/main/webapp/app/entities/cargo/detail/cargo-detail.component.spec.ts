import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CargoDetailComponent } from './cargo-detail.component';

describe('Component Tests', () => {
  describe('Cargo Management Detail Component', () => {
    let comp: CargoDetailComponent;
    let fixture: ComponentFixture<CargoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CargoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ cargo: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CargoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CargoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load cargo on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.cargo).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
