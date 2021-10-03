jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { InmuebleService } from '../service/inmueble.service';
import { IInmueble, Inmueble } from '../inmueble.model';
import { IUsuarioEx } from 'app/entities/usuario-ex/usuario-ex.model';
import { UsuarioExService } from 'app/entities/usuario-ex/service/usuario-ex.service';

import { InmuebleUpdateComponent } from './inmueble-update.component';

describe('Component Tests', () => {
  describe('Inmueble Management Update Component', () => {
    let comp: InmuebleUpdateComponent;
    let fixture: ComponentFixture<InmuebleUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let inmuebleService: InmuebleService;
    let usuarioExService: UsuarioExService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [InmuebleUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(InmuebleUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(InmuebleUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      inmuebleService = TestBed.inject(InmuebleService);
      usuarioExService = TestBed.inject(UsuarioExService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call UsuarioEx query and add missing value', () => {
        const inmueble: IInmueble = { id: 456 };
        const usuarioEx: IUsuarioEx = { id: 2737 };
        inmueble.usuarioEx = usuarioEx;

        const usuarioExCollection: IUsuarioEx[] = [{ id: 63141 }];
        spyOn(usuarioExService, 'query').and.returnValue(of(new HttpResponse({ body: usuarioExCollection })));
        const additionalUsuarioExes = [usuarioEx];
        const expectedCollection: IUsuarioEx[] = [...additionalUsuarioExes, ...usuarioExCollection];
        spyOn(usuarioExService, 'addUsuarioExToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ inmueble });
        comp.ngOnInit();

        expect(usuarioExService.query).toHaveBeenCalled();
        expect(usuarioExService.addUsuarioExToCollectionIfMissing).toHaveBeenCalledWith(usuarioExCollection, ...additionalUsuarioExes);
        expect(comp.usuarioExesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const inmueble: IInmueble = { id: 456 };
        const usuarioEx: IUsuarioEx = { id: 84134 };
        inmueble.usuarioEx = usuarioEx;

        activatedRoute.data = of({ inmueble });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(inmueble));
        expect(comp.usuarioExesSharedCollection).toContain(usuarioEx);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const inmueble = { id: 123 };
        spyOn(inmuebleService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ inmueble });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: inmueble }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(inmuebleService.update).toHaveBeenCalledWith(inmueble);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const inmueble = new Inmueble();
        spyOn(inmuebleService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ inmueble });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: inmueble }));
        saveSubject.complete();

        // THEN
        expect(inmuebleService.create).toHaveBeenCalledWith(inmueble);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const inmueble = { id: 123 };
        spyOn(inmuebleService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ inmueble });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(inmuebleService.update).toHaveBeenCalledWith(inmueble);
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
