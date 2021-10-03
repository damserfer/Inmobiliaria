jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CargoService } from '../service/cargo.service';
import { ICargo, Cargo } from '../cargo.model';
import { IIngreso } from 'app/entities/ingreso/ingreso.model';
import { IngresoService } from 'app/entities/ingreso/service/ingreso.service';
import { IContrato } from 'app/entities/contrato/contrato.model';
import { ContratoService } from 'app/entities/contrato/service/contrato.service';

import { CargoUpdateComponent } from './cargo-update.component';

describe('Component Tests', () => {
  describe('Cargo Management Update Component', () => {
    let comp: CargoUpdateComponent;
    let fixture: ComponentFixture<CargoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let cargoService: CargoService;
    let ingresoService: IngresoService;
    let contratoService: ContratoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CargoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CargoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CargoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      cargoService = TestBed.inject(CargoService);
      ingresoService = TestBed.inject(IngresoService);
      contratoService = TestBed.inject(ContratoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call ingreso query and add missing value', () => {
        const cargo: ICargo = { id: 456 };
        const ingreso: IIngreso = { id: 95954 };
        cargo.ingreso = ingreso;

        const ingresoCollection: IIngreso[] = [{ id: 45658 }];
        spyOn(ingresoService, 'query').and.returnValue(of(new HttpResponse({ body: ingresoCollection })));
        const expectedCollection: IIngreso[] = [ingreso, ...ingresoCollection];
        spyOn(ingresoService, 'addIngresoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ cargo });
        comp.ngOnInit();

        expect(ingresoService.query).toHaveBeenCalled();
        expect(ingresoService.addIngresoToCollectionIfMissing).toHaveBeenCalledWith(ingresoCollection, ingreso);
        expect(comp.ingresosCollection).toEqual(expectedCollection);
      });

      it('Should call Contrato query and add missing value', () => {
        const cargo: ICargo = { id: 456 };
        const contrato: IContrato = { id: 89799 };
        cargo.contrato = contrato;

        const contratoCollection: IContrato[] = [{ id: 71741 }];
        spyOn(contratoService, 'query').and.returnValue(of(new HttpResponse({ body: contratoCollection })));
        const additionalContratoes = [contrato];
        const expectedCollection: IContrato[] = [...additionalContratoes, ...contratoCollection];
        spyOn(contratoService, 'addContratoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ cargo });
        comp.ngOnInit();

        expect(contratoService.query).toHaveBeenCalled();
        expect(contratoService.addContratoToCollectionIfMissing).toHaveBeenCalledWith(contratoCollection, ...additionalContratoes);
        expect(comp.contratoesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const cargo: ICargo = { id: 456 };
        const ingreso: IIngreso = { id: 1471 };
        cargo.ingreso = ingreso;
        const contrato: IContrato = { id: 10880 };
        cargo.contrato = contrato;

        activatedRoute.data = of({ cargo });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(cargo));
        expect(comp.ingresosCollection).toContain(ingreso);
        expect(comp.contratoesSharedCollection).toContain(contrato);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cargo = { id: 123 };
        spyOn(cargoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cargo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cargo }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(cargoService.update).toHaveBeenCalledWith(cargo);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cargo = new Cargo();
        spyOn(cargoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cargo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: cargo }));
        saveSubject.complete();

        // THEN
        expect(cargoService.create).toHaveBeenCalledWith(cargo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const cargo = { id: 123 };
        spyOn(cargoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ cargo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(cargoService.update).toHaveBeenCalledWith(cargo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackIngresoById', () => {
        it('Should return tracked Ingreso primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackIngresoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

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
