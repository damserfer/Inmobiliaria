import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IServicio, Servicio } from '../servicio.model';

import { ServicioService } from './servicio.service';

describe('Service Tests', () => {
  describe('Servicio Service', () => {
    let service: ServicioService;
    let httpMock: HttpTestingController;
    let elemDefault: IServicio;
    let expectedResult: IServicio | IServicio[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ServicioService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nombre: 'AAAAAAA',
        precioHoras: 0,
        horas: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Servicio', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Servicio()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Servicio', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nombre: 'BBBBBB',
            precioHoras: 1,
            horas: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Servicio', () => {
        const patchObject = Object.assign(
          {
            nombre: 'BBBBBB',
          },
          new Servicio()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Servicio', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nombre: 'BBBBBB',
            precioHoras: 1,
            horas: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Servicio', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addServicioToCollectionIfMissing', () => {
        it('should add a Servicio to an empty array', () => {
          const servicio: IServicio = { id: 123 };
          expectedResult = service.addServicioToCollectionIfMissing([], servicio);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(servicio);
        });

        it('should not add a Servicio to an array that contains it', () => {
          const servicio: IServicio = { id: 123 };
          const servicioCollection: IServicio[] = [
            {
              ...servicio,
            },
            { id: 456 },
          ];
          expectedResult = service.addServicioToCollectionIfMissing(servicioCollection, servicio);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Servicio to an array that doesn't contain it", () => {
          const servicio: IServicio = { id: 123 };
          const servicioCollection: IServicio[] = [{ id: 456 }];
          expectedResult = service.addServicioToCollectionIfMissing(servicioCollection, servicio);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(servicio);
        });

        it('should add only unique Servicio to an array', () => {
          const servicioArray: IServicio[] = [{ id: 123 }, { id: 456 }, { id: 82916 }];
          const servicioCollection: IServicio[] = [{ id: 123 }];
          expectedResult = service.addServicioToCollectionIfMissing(servicioCollection, ...servicioArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const servicio: IServicio = { id: 123 };
          const servicio2: IServicio = { id: 456 };
          expectedResult = service.addServicioToCollectionIfMissing([], servicio, servicio2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(servicio);
          expect(expectedResult).toContain(servicio2);
        });

        it('should accept null and undefined values', () => {
          const servicio: IServicio = { id: 123 };
          expectedResult = service.addServicioToCollectionIfMissing([], null, servicio, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(servicio);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
