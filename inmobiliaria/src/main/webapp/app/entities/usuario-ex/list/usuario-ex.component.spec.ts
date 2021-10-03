import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UsuarioExService } from '../service/usuario-ex.service';

import { UsuarioExComponent } from './usuario-ex.component';

describe('Component Tests', () => {
  describe('UsuarioEx Management Component', () => {
    let comp: UsuarioExComponent;
    let fixture: ComponentFixture<UsuarioExComponent>;
    let service: UsuarioExService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UsuarioExComponent],
      })
        .overrideTemplate(UsuarioExComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UsuarioExComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(UsuarioExService);

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
      expect(comp.usuarioExes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
