import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FotoHabitacionService } from '../service/foto-habitacion.service';

import { FotoHabitacionComponent } from './foto-habitacion.component';

describe('Component Tests', () => {
  describe('FotoHabitacion Management Component', () => {
    let comp: FotoHabitacionComponent;
    let fixture: ComponentFixture<FotoHabitacionComponent>;
    let service: FotoHabitacionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FotoHabitacionComponent],
      })
        .overrideTemplate(FotoHabitacionComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FotoHabitacionComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FotoHabitacionService);

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
      expect(comp.fotoHabitacions?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
