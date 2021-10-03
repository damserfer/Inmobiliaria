jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ServicioService } from '../service/servicio.service';
import { IServicio, Servicio } from '../servicio.model';
import { IInmueble } from 'app/entities/inmueble/inmueble.model';
import { InmuebleService } from 'app/entities/inmueble/service/inmueble.service';
import { IEmpresa } from 'app/entities/empresa/empresa.model';
import { EmpresaService } from 'app/entities/empresa/service/empresa.service';

import { ServicioUpdateComponent } from './servicio-update.component';

describe('Component Tests', () => {
  describe('Servicio Management Update Component', () => {
    let comp: ServicioUpdateComponent;
    let fixture: ComponentFixture<ServicioUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let servicioService: ServicioService;
    let inmuebleService: InmuebleService;
    let empresaService: EmpresaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ServicioUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ServicioUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ServicioUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      servicioService = TestBed.inject(ServicioService);
      inmuebleService = TestBed.inject(InmuebleService);
      empresaService = TestBed.inject(EmpresaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Inmueble query and add missing value', () => {
        const servicio: IServicio = { id: 456 };
        const inmueble: IInmueble = { id: 42997 };
        servicio.inmueble = inmueble;

        const inmuebleCollection: IInmueble[] = [{ id: 83100 }];
        spyOn(inmuebleService, 'query').and.returnValue(of(new HttpResponse({ body: inmuebleCollection })));
        const additionalInmuebles = [inmueble];
        const expectedCollection: IInmueble[] = [...additionalInmuebles, ...inmuebleCollection];
        spyOn(inmuebleService, 'addInmuebleToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ servicio });
        comp.ngOnInit();

        expect(inmuebleService.query).toHaveBeenCalled();
        expect(inmuebleService.addInmuebleToCollectionIfMissing).toHaveBeenCalledWith(inmuebleCollection, ...additionalInmuebles);
        expect(comp.inmueblesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Empresa query and add missing value', () => {
        const servicio: IServicio = { id: 456 };
        const empresa: IEmpresa = { id: 58824 };
        servicio.empresa = empresa;

        const empresaCollection: IEmpresa[] = [{ id: 52415 }];
        spyOn(empresaService, 'query').and.returnValue(of(new HttpResponse({ body: empresaCollection })));
        const additionalEmpresas = [empresa];
        const expectedCollection: IEmpresa[] = [...additionalEmpresas, ...empresaCollection];
        spyOn(empresaService, 'addEmpresaToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ servicio });
        comp.ngOnInit();

        expect(empresaService.query).toHaveBeenCalled();
        expect(empresaService.addEmpresaToCollectionIfMissing).toHaveBeenCalledWith(empresaCollection, ...additionalEmpresas);
        expect(comp.empresasSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const servicio: IServicio = { id: 456 };
        const inmueble: IInmueble = { id: 69281 };
        servicio.inmueble = inmueble;
        const empresa: IEmpresa = { id: 43895 };
        servicio.empresa = empresa;

        activatedRoute.data = of({ servicio });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(servicio));
        expect(comp.inmueblesSharedCollection).toContain(inmueble);
        expect(comp.empresasSharedCollection).toContain(empresa);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const servicio = { id: 123 };
        spyOn(servicioService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ servicio });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: servicio }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(servicioService.update).toHaveBeenCalledWith(servicio);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const servicio = new Servicio();
        spyOn(servicioService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ servicio });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: servicio }));
        saveSubject.complete();

        // THEN
        expect(servicioService.create).toHaveBeenCalledWith(servicio);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const servicio = { id: 123 };
        spyOn(servicioService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ servicio });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(servicioService.update).toHaveBeenCalledWith(servicio);
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

      describe('trackEmpresaById', () => {
        it('Should return tracked Empresa primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackEmpresaById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
