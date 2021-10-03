jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ContratoService } from '../service/contrato.service';
import { IContrato, Contrato } from '../contrato.model';
import { IUsuarioEx } from 'app/entities/usuario-ex/usuario-ex.model';
import { UsuarioExService } from 'app/entities/usuario-ex/service/usuario-ex.service';
import { IInmueble } from 'app/entities/inmueble/inmueble.model';
import { InmuebleService } from 'app/entities/inmueble/service/inmueble.service';

import { ContratoUpdateComponent } from './contrato-update.component';

describe('Component Tests', () => {
  describe('Contrato Management Update Component', () => {
    let comp: ContratoUpdateComponent;
    let fixture: ComponentFixture<ContratoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let contratoService: ContratoService;
    let usuarioExService: UsuarioExService;
    let inmuebleService: InmuebleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ContratoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ContratoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ContratoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      contratoService = TestBed.inject(ContratoService);
      usuarioExService = TestBed.inject(UsuarioExService);
      inmuebleService = TestBed.inject(InmuebleService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call UsuarioEx query and add missing value', () => {
        const contrato: IContrato = { id: 456 };
        const usuarioEx: IUsuarioEx = { id: 59424 };
        contrato.usuarioEx = usuarioEx;

        const usuarioExCollection: IUsuarioEx[] = [{ id: 91270 }];
        spyOn(usuarioExService, 'query').and.returnValue(of(new HttpResponse({ body: usuarioExCollection })));
        const additionalUsuarioExes = [usuarioEx];
        const expectedCollection: IUsuarioEx[] = [...additionalUsuarioExes, ...usuarioExCollection];
        spyOn(usuarioExService, 'addUsuarioExToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ contrato });
        comp.ngOnInit();

        expect(usuarioExService.query).toHaveBeenCalled();
        expect(usuarioExService.addUsuarioExToCollectionIfMissing).toHaveBeenCalledWith(usuarioExCollection, ...additionalUsuarioExes);
        expect(comp.usuarioExesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Inmueble query and add missing value', () => {
        const contrato: IContrato = { id: 456 };
        const inmueble: IInmueble = { id: 21179 };
        contrato.inmueble = inmueble;

        const inmuebleCollection: IInmueble[] = [{ id: 19885 }];
        spyOn(inmuebleService, 'query').and.returnValue(of(new HttpResponse({ body: inmuebleCollection })));
        const additionalInmuebles = [inmueble];
        const expectedCollection: IInmueble[] = [...additionalInmuebles, ...inmuebleCollection];
        spyOn(inmuebleService, 'addInmuebleToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ contrato });
        comp.ngOnInit();

        expect(inmuebleService.query).toHaveBeenCalled();
        expect(inmuebleService.addInmuebleToCollectionIfMissing).toHaveBeenCalledWith(inmuebleCollection, ...additionalInmuebles);
        expect(comp.inmueblesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const contrato: IContrato = { id: 456 };
        const usuarioEx: IUsuarioEx = { id: 32749 };
        contrato.usuarioEx = usuarioEx;
        const inmueble: IInmueble = { id: 58247 };
        contrato.inmueble = inmueble;

        activatedRoute.data = of({ contrato });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(contrato));
        expect(comp.usuarioExesSharedCollection).toContain(usuarioEx);
        expect(comp.inmueblesSharedCollection).toContain(inmueble);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const contrato = { id: 123 };
        spyOn(contratoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ contrato });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: contrato }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(contratoService.update).toHaveBeenCalledWith(contrato);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const contrato = new Contrato();
        spyOn(contratoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ contrato });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: contrato }));
        saveSubject.complete();

        // THEN
        expect(contratoService.create).toHaveBeenCalledWith(contrato);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const contrato = { id: 123 };
        spyOn(contratoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ contrato });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(contratoService.update).toHaveBeenCalledWith(contrato);
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

      describe('trackInmuebleById', () => {
        it('Should return tracked Inmueble primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackInmuebleById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
