import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UsuarioExDetailComponent } from './usuario-ex-detail.component';

describe('Component Tests', () => {
  describe('UsuarioEx Management Detail Component', () => {
    let comp: UsuarioExDetailComponent;
    let fixture: ComponentFixture<UsuarioExDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [UsuarioExDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ usuarioEx: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(UsuarioExDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UsuarioExDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load usuarioEx on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.usuarioEx).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
