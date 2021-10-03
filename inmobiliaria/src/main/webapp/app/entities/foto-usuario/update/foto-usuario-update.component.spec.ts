jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FotoUsuarioService } from '../service/foto-usuario.service';
import { IFotoUsuario, FotoUsuario } from '../foto-usuario.model';
import { IUsuarioEx } from 'app/entities/usuario-ex/usuario-ex.model';
import { UsuarioExService } from 'app/entities/usuario-ex/service/usuario-ex.service';

import { FotoUsuarioUpdateComponent } from './foto-usuario-update.component';

describe('Component Tests', () => {
  describe('FotoUsuario Management Update Component', () => {
    let comp: FotoUsuarioUpdateComponent;
    let fixture: ComponentFixture<FotoUsuarioUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let fotoUsuarioService: FotoUsuarioService;
    let usuarioExService: UsuarioExService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FotoUsuarioUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FotoUsuarioUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FotoUsuarioUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      fotoUsuarioService = TestBed.inject(FotoUsuarioService);
      usuarioExService = TestBed.inject(UsuarioExService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call UsuarioEx query and add missing value', () => {
        const fotoUsuario: IFotoUsuario = { id: 456 };
        const usuarioEx: IUsuarioEx = { id: 79210 };
        fotoUsuario.usuarioEx = usuarioEx;

        const usuarioExCollection: IUsuarioEx[] = [{ id: 41536 }];
        spyOn(usuarioExService, 'query').and.returnValue(of(new HttpResponse({ body: usuarioExCollection })));
        const additionalUsuarioExes = [usuarioEx];
        const expectedCollection: IUsuarioEx[] = [...additionalUsuarioExes, ...usuarioExCollection];
        spyOn(usuarioExService, 'addUsuarioExToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ fotoUsuario });
        comp.ngOnInit();

        expect(usuarioExService.query).toHaveBeenCalled();
        expect(usuarioExService.addUsuarioExToCollectionIfMissing).toHaveBeenCalledWith(usuarioExCollection, ...additionalUsuarioExes);
        expect(comp.usuarioExesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const fotoUsuario: IFotoUsuario = { id: 456 };
        const usuarioEx: IUsuarioEx = { id: 55063 };
        fotoUsuario.usuarioEx = usuarioEx;

        activatedRoute.data = of({ fotoUsuario });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(fotoUsuario));
        expect(comp.usuarioExesSharedCollection).toContain(usuarioEx);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fotoUsuario = { id: 123 };
        spyOn(fotoUsuarioService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fotoUsuario });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fotoUsuario }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(fotoUsuarioService.update).toHaveBeenCalledWith(fotoUsuario);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fotoUsuario = new FotoUsuario();
        spyOn(fotoUsuarioService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fotoUsuario });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fotoUsuario }));
        saveSubject.complete();

        // THEN
        expect(fotoUsuarioService.create).toHaveBeenCalledWith(fotoUsuario);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fotoUsuario = { id: 123 };
        spyOn(fotoUsuarioService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fotoUsuario });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(fotoUsuarioService.update).toHaveBeenCalledWith(fotoUsuario);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUsuarioExById', () => {
        it('Should return tracked UsuarioEx primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUsuarioExById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
