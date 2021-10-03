import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FotoHabitacionDetailComponent } from './foto-habitacion-detail.component';

describe('Component Tests', () => {
  describe('FotoHabitacion Management Detail Component', () => {
    let comp: FotoHabitacionDetailComponent;
    let fixture: ComponentFixture<FotoHabitacionDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FotoHabitacionDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ fotoHabitacion: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(FotoHabitacionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FotoHabitacionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load fotoHabitacion on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.fotoHabitacion).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
