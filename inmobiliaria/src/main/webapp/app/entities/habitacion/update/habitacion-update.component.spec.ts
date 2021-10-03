jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { HabitacionService } from '../service/habitacion.service';
import { IHabitacion, Habitacion } from '../habitacion.model';
import { IInmueble } from 'app/entities/inmueble/inmueble.model';
import { InmuebleService } from 'app/entities/inmueble/service/inmueble.service';

import { HabitacionUpdateComponent } from './habitacion-update.component';

describe('Component Tests', () => {
  describe('Habitacion Management Update Component', () => {
    let comp: HabitacionUpdateComponent;
    let fixture: ComponentFixture<HabitacionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let habitacionService: HabitacionService;
    let inmuebleService: InmuebleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [HabitacionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(HabitacionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HabitacionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      habitacionService = TestBed.inject(HabitacionService);
      inmuebleService = TestBed.inject(InmuebleService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Inmueble query and add missing value', () => {
        const habitacion: IHabitacion = { id: 456 };
        const inmueble: IInmueble = { id: 13972 };
        habitacion.inmueble = inmueble;

        const inmuebleCollection: IInmueble[] = [{ id: 70823 }];
        spyOn(inmuebleService, 'query').and.returnValue(of(new HttpResponse({ body: inmuebleCollection })));
        const additionalInmuebles = [inmueble];
        const expectedCollection: IInmueble[] = [...additionalInmuebles, ...inmuebleCollection];
        spyOn(inmuebleService, 'addInmuebleToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ habitacion });
        comp.ngOnInit();

        expect(inmuebleService.query).toHaveBeenCalled();
        expect(inmuebleService.addInmuebleToCollectionIfMissing).toHaveBeenCalledWith(inmuebleCollection, ...additionalInmuebles);
        expect(comp.inmueblesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const habitacion: IHabitacion = { id: 456 };
        const inmueble: IInmueble = { id: 62147 };
        habitacion.inmueble = inmueble;

        activatedRoute.data = of({ habitacion });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(habitacion));
        expect(comp.inmueblesSharedCollection).toContain(inmueble);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const habitacion = { id: 123 };
        spyOn(habitacionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ habitacion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: habitacion }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(habitacionService.update).toHaveBeenCalledWith(habitacion);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const habitacion = new Habitacion();
        spyOn(habitacionService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ habitacion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: habitacion }));
        saveSubject.complete();

        // THEN
        expect(habitacionService.create).toHaveBeenCalledWith(habitacion);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const habitacion = { id: 123 };
        spyOn(habitacionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ habitacion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(habitacionService.update).toHaveBeenCalledWith(habitacion);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
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
