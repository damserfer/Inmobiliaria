import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HabitacionDetailComponent } from './habitacion-detail.component';

describe('Component Tests', () => {
  describe('Habitacion Management Detail Component', () => {
    let comp: HabitacionDetailComponent;
    let fixture: ComponentFixture<HabitacionDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [HabitacionDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ habitacion: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(HabitacionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(HabitacionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load habitacion on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.habitacion).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
