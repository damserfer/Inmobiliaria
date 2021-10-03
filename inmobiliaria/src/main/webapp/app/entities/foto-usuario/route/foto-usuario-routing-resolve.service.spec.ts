jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFotoUsuario, FotoUsuario } from '../foto-usuario.model';
import { FotoUsuarioService } from '../service/foto-usuario.service';

import { FotoUsuarioRoutingResolveService } from './foto-usuario-routing-resolve.service';

describe('Service Tests', () => {
  describe('FotoUsuario routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: FotoUsuarioRoutingResolveService;
    let service: FotoUsuarioService;
    let resultFotoUsuario: IFotoUsuario | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(FotoUsuarioRoutingResolveService);
      service = TestBed.inject(FotoUsuarioService);
      resultFotoUsuario = undefined;
    });

    describe('resolve', () => {
      it('should return IFotoUsuario returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFotoUsuario = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFotoUsuario).toEqual({ id: 123 });
      });

      it('should return new IFotoUsuario if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFotoUsuario = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultFotoUsuario).toEqual(new FotoUsuario());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFotoUsuario = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultFotoUsuario).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
