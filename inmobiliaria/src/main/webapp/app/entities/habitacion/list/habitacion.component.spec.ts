import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { HabitacionService } from '../service/habitacion.service';

import { HabitacionComponent } from './habitacion.component';

describe('Component Tests', () => {
  describe('Habitacion Management Component', () => {
    let comp: HabitacionComponent;
    let fixture: ComponentFixture<HabitacionComponent>;
    let service: HabitacionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [HabitacionComponent],
      })
        .overrideTemplate(HabitacionComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HabitacionComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(HabitacionService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.habitacions?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
