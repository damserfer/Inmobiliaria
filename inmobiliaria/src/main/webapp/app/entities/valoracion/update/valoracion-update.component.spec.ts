jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ValoracionService } from '../service/valoracion.service';
import { IValoracion, Valoracion } from '../valoracion.model';
import { IContrato } from 'app/entities/contrato/contrato.model';
import { ContratoService } from 'app/entities/contrato/service/contrato.service';

import { ValoracionUpdateComponent } from './valoracion-update.component';

describe('Component Tests', () => {
  describe('Valoracion Management Update Component', () => {
    let comp: ValoracionUpdateComponent;
    let fixture: ComponentFixture<ValoracionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let valoracionService: ValoracionService;
    let contratoService: ContratoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ValoracionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ValoracionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ValoracionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      valoracionService = TestBed.inject(ValoracionService);
      contratoService = TestBed.inject(ContratoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Contrato query and add missing value', () => {
        const valoracion: IValoracion = { id: 456 };
        const contrato: IContrato = { id: 42392 };
        valoracion.contrato = contrato;

        const contratoCollection: IContrato[] = [{ id: 17647 }];
        spyOn(contratoService, 'query').and.returnValue(of(new HttpResponse({ body: contratoCollection })));
        const additionalContratoes = [contrato];
        const expectedCollection: IContrato[] = [...additionalContratoes, ...contratoCollection];
        spyOn(contratoService, 'addContratoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ valoracion });
        comp.ngOnInit();

        expect(contratoService.query).toHaveBeenCalled();
        expect(contratoService.addContratoToCollectionIfMissing).toHaveBeenCalledWith(contratoCollection, ...additionalContratoes);
        expect(comp.contratoesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const valoracion: IValoracion = { id: 456 };
        const contrato: IContrato = { id: 32636 };
        valoracion.contrato = contrato;

        activatedRoute.data = of({ valoracion });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(valoracion));
        expect(comp.contratoesSharedCollection).toContain(contrato);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const valoracion = { id: 123 };
        spyOn(valoracionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ valoracion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: valoracion }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(valoracionService.update).toHaveBeenCalledWith(valoracion);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const valoracion = new Valoracion();
        spyOn(valoracionService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ valoracion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: valoracion }));
        saveSubject.complete();

        // THEN
        expect(valoracionService.create).toHaveBeenCalledWith(valoracion);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const valoracion = { id: 123 };
        spyOn(valoracionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ valoracion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(valoracionService.update).toHaveBeenCalledWith(valoracion);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackContratoById', () => {
        it('Should return tracked Contrato primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackContratoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
