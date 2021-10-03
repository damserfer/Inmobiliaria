import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { IngresoService } from '../service/ingreso.service';

import { IngresoComponent } from './ingreso.component';

describe('Component Tests', () => {
  describe('Ingreso Management Component', () => {
    let comp: IngresoComponent;
    let fixture: ComponentFixture<IngresoComponent>;
    let service: IngresoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [IngresoComponent],
      })
        .overrideTemplate(IngresoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(IngresoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(IngresoService);

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
      expect(comp.ingresos?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
