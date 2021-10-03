jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IValoracion, Valoracion } from '../valoracion.model';
import { ValoracionService } from '../service/valoracion.service';

import { ValoracionRoutingResolveService } from './valoracion-routing-resolve.service';

describe('Service Tests', () => {
  describe('Valoracion routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ValoracionRoutingResolveService;
    let service: ValoracionService;
    let resultValoracion: IValoracion | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ValoracionRoutingResolveService);
      service = TestBed.inject(ValoracionService);
      resultValoracion = undefined;
    });

    describe('resolve', () => {
      it('should return IValoracion returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultValoracion = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultValoracion).toEqual({ id: 123 });
      });

      it('should return new IValoracion if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultValoracion = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultValoracion).toEqual(new Valoracion());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultValoracion = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultValoracion).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
