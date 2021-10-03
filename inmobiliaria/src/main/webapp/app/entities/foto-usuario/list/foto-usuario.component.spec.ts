import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FotoUsuarioService } from '../service/foto-usuario.service';

import { FotoUsuarioComponent } from './foto-usuario.component';

describe('Component Tests', () => {
  describe('FotoUsuario Management Component', () => {
    let comp: FotoUsuarioComponent;
    let fixture: ComponentFixture<FotoUsuarioComponent>;
    let service: FotoUsuarioService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FotoUsuarioComponent],
      })
        .overrideTemplate(FotoUsuarioComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FotoUsuarioComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FotoUsuarioService);

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
      expect(comp.fotoUsuarios?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
