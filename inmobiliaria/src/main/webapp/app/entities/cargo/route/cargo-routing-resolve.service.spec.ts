jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICargo, Cargo } from '../cargo.model';
import { CargoService } from '../service/cargo.service';

import { CargoRoutingResolveService } from './cargo-routing-resolve.service';

describe('Service Tests', () => {
  describe('Cargo routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CargoRoutingResolveService;
    let service: CargoService;
    let resultCargo: ICargo | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CargoRoutingResolveService);
      service = TestBed.inject(CargoService);
      resultCargo = undefined;
    });

    describe('resolve', () => {
      it('should return ICargo returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCargo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCargo).toEqual({ id: 123 });
      });

      it('should return new ICargo if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCargo = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCargo).toEqual(new Cargo());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCargo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCargo).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
