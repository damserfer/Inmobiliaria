jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UsuarioExService } from '../service/usuario-ex.service';
import { IUsuarioEx, UsuarioEx } from '../usuario-ex.model';

import { UsuarioExUpdateComponent } from './usuario-ex-update.component';

describe('Component Tests', () => {
  describe('UsuarioEx Management Update Component', () => {
    let comp: UsuarioExUpdateComponent;
    let fixture: ComponentFixture<UsuarioExUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let usuarioExService: UsuarioExService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UsuarioExUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(UsuarioExUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UsuarioExUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      usuarioExService = TestBed.inject(UsuarioExService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const usuarioEx: IUsuarioEx = { id: 456 };

        activatedRoute.data = of({ usuarioEx });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(usuarioEx));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const usuarioEx = { id: 123 };
        spyOn(usuarioExService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ usuarioEx });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: usuarioEx }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(usuarioExService.update).toHaveBeenCalledWith(usuarioEx);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const usuarioEx = new UsuarioEx();
        spyOn(usuarioExService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ usuarioEx });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: usuarioEx }));
        saveSubject.complete();

        // THEN
        expect(usuarioExService.create).toHaveBeenCalledWith(usuarioEx);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const usuarioEx = { id: 123 };
        spyOn(usuarioExService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ usuarioEx });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(usuarioExService.update).toHaveBeenCalledWith(usuarioEx);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
