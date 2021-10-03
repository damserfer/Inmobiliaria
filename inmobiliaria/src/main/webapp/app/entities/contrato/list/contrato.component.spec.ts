import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ContratoService } from '../service/contrato.service';

import { ContratoComponent } from './contrato.component';

describe('Component Tests', () => {
  describe('Contrato Management Component', () => {
    let comp: ContratoComponent;
    let fixture: ComponentFixture<ContratoComponent>;
    let service: ContratoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ContratoComponent],
      })
        .overrideTemplate(ContratoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ContratoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ContratoService);

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
      expect(comp.contratoes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
