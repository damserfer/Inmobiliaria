import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IngresoDetailComponent } from './ingreso-detail.component';

describe('Component Tests', () => {
  describe('Ingreso Management Detail Component', () => {
    let comp: IngresoDetailComponent;
    let fixture: ComponentFixture<IngresoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [IngresoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ ingreso: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(IngresoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(IngresoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load ingreso on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.ingreso).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
