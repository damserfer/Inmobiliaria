import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InmuebleDetailComponent } from './inmueble-detail.component';

describe('Component Tests', () => {
  describe('Inmueble Management Detail Component', () => {
    let comp: InmuebleDetailComponent;
    let fixture: ComponentFixture<InmuebleDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [InmuebleDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ inmueble: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(InmuebleDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(InmuebleDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load inmueble on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.inmueble).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
