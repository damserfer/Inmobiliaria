jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IHabitacion, Habitacion } from '../habitacion.model';
import { HabitacionService } from '../service/habitacion.service';

import { HabitacionRoutingResolveService } from './habitacion-routing-resolve.service';

describe('Service Tests', () => {
  describe('Habitacion routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: HabitacionRoutingResolveService;
    let service: HabitacionService;
    let resultHabitacion: IHabitacion | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(HabitacionRoutingResolveService);
      service = TestBed.inject(HabitacionService);
      resultHabitacion = undefined;
    });

    describe('resolve', () => {
      it('should return IHabitacion returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultHabitacion = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultHabitacion).toEqual({ id: 123 });
      });

      it('should return new IHabitacion if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultHabitacion = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultHabitacion).toEqual(new Habitacion());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultHabitacion = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultHabitacion).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
