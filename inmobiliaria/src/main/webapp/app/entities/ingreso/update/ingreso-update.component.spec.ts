jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { IngresoService } from '../service/ingreso.service';
import { IIngreso, Ingreso } from '../ingreso.model';

import { IngresoUpdateComponent } from './ingreso-update.component';

describe('Component Tests', () => {
  describe('Ingreso Management Update Component', () => {
    let comp: IngresoUpdateComponent;
    let fixture: ComponentFixture<IngresoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let ingresoService: IngresoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [IngresoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(IngresoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(IngresoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      ingresoService = TestBed.inject(IngresoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const ingreso: IIngreso = { id: 456 };

        activatedRoute.data = of({ ingreso });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(ingreso));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const ingreso = { id: 123 };
        spyOn(ingresoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ ingreso });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ingreso }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(ingresoService.update).toHaveBeenCalledWith(ingreso);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const ingreso = new Ingreso();
        spyOn(ingresoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ ingreso });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: ingreso }));
        saveSubject.complete();

        // THEN
        expect(ingresoService.create).toHaveBeenCalledWith(ingreso);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const ingreso = { id: 123 };
        spyOn(ingresoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ ingreso });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(ingresoService.update).toHaveBeenCalledWith(ingreso);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
