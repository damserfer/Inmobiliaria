import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FotoUsuarioDetailComponent } from './foto-usuario-detail.component';

describe('Component Tests', () => {
  describe('FotoUsuario Management Detail Component', () => {
    let comp: FotoUsuarioDetailComponent;
    let fixture: ComponentFixture<FotoUsuarioDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FotoUsuarioDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ fotoUsuario: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(FotoUsuarioDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FotoUsuarioDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load fotoUsuario on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.fotoUsuario).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
