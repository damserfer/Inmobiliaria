jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IIngreso, Ingreso } from '../ingreso.model';
import { IngresoService } from '../service/ingreso.service';

import { IngresoRoutingResolveService } from './ingreso-routing-resolve.service';

describe('Service Tests', () => {
  describe('Ingreso routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: IngresoRoutingResolveService;
    let service: IngresoService;
    let resultIngreso: IIngreso | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(IngresoRoutingResolveService);
      service = TestBed.inject(IngresoService);
      resultIngreso = undefined;
    });

    describe('resolve', () => {
      it('should return IIngreso returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultIngreso = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultIngreso).toEqual({ id: 123 });
      });

      it('should return new IIngreso if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultIngreso = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultIngreso).toEqual(new Ingreso());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultIngreso = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultIngreso).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
