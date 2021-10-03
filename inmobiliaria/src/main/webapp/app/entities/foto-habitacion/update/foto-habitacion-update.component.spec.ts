jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FotoHabitacionService } from '../service/foto-habitacion.service';
import { IFotoHabitacion, FotoHabitacion } from '../foto-habitacion.model';
import { IHabitacion } from 'app/entities/habitacion/habitacion.model';
import { HabitacionService } from 'app/entities/habitacion/service/habitacion.service';

import { FotoHabitacionUpdateComponent } from './foto-habitacion-update.component';

describe('Component Tests', () => {
  describe('FotoHabitacion Management Update Component', () => {
    let comp: FotoHabitacionUpdateComponent;
    let fixture: ComponentFixture<FotoHabitacionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let fotoHabitacionService: FotoHabitacionService;
    let habitacionService: HabitacionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FotoHabitacionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FotoHabitacionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FotoHabitacionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      fotoHabitacionService = TestBed.inject(FotoHabitacionService);
      habitacionService = TestBed.inject(HabitacionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Habitacion query and add missing value', () => {
        const fotoHabitacion: IFotoHabitacion = { id: 456 };
        const habitacion: IHabitacion = { id: 93936 };
        fotoHabitacion.habitacion = habitacion;

        const habitacionCollection: IHabitacion[] = [{ id: 0 }];
        spyOn(habitacionService, 'query').and.returnValue(of(new HttpResponse({ body: habitacionCollection })));
        const additionalHabitacions = [habitacion];
        const expectedCollection: IHabitacion[] = [...additionalHabitacions, ...habitacionCollection];
        spyOn(habitacionService, 'addHabitacionToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ fotoHabitacion });
        comp.ngOnInit();

        expect(habitacionService.query).toHaveBeenCalled();
        expect(habitacionService.addHabitacionToCollectionIfMissing).toHaveBeenCalledWith(habitacionCollection, ...additionalHabitacions);
        expect(comp.habitacionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const fotoHabitacion: IFotoHabitacion = { id: 456 };
        const habitacion: IHabitacion = { id: 74762 };
        fotoHabitacion.habitacion = habitacion;

        activatedRoute.data = of({ fotoHabitacion });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(fotoHabitacion));
        expect(comp.habitacionsSharedCollection).toContain(habitacion);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fotoHabitacion = { id: 123 };
        spyOn(fotoHabitacionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fotoHabitacion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fotoHabitacion }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(fotoHabitacionService.update).toHaveBeenCalledWith(fotoHabitacion);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fotoHabitacion = new FotoHabitacion();
        spyOn(fotoHabitacionService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fotoHabitacion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fotoHabitacion }));
        saveSubject.complete();

        // THEN
        expect(fotoHabitacionService.create).toHaveBeenCalledWith(fotoHabitacion);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const fotoHabitacion = { id: 123 };
        spyOn(fotoHabitacionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ fotoHabitacion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(fotoHabitacionService.update).toHaveBeenCalledWith(fotoHabitacion);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackHabitacionById', () => {
        it('Should return tracked Habitacion primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackHabitacionById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
