import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IIngreso, Ingreso } from '../ingreso.model';

import { IngresoService } from './ingreso.service';

describe('Service Tests', () => {
  describe('Ingreso Service', () => {
    let service: IngresoService;
    let httpMock: HttpTestingController;
    let elemDefault: IIngreso;
    let expectedResult: IIngreso | IIngreso[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(IngresoService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        mes: currentDate,
        concepto: 'AAAAAAA',
        cantidad: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            mes: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Ingreso', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            mes: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            mes: currentDate,
          },
          returnedFromService
        );

        service.create(new Ingreso()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Ingreso', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            mes: currentDate.format(DATE_FORMAT),
            concepto: 'BBBBBB',
            cantidad: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            mes: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Ingreso', () => {
        const patchObject = Object.assign({}, new Ingreso());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            mes: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Ingreso', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            mes: currentDate.format(DATE_FORMAT),
            concepto: 'BBBBBB',
            cantidad: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            mes: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Ingreso', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addIngresoToCollectionIfMissing', () => {
        it('should add a Ingreso to an empty array', () => {
          const ingreso: IIngreso = { id: 123 };
          expectedResult = service.addIngresoToCollectionIfMissing([], ingreso);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ingreso);
        });

        it('should not add a Ingreso to an array that contains it', () => {
          const ingreso: IIngreso = { id: 123 };
          const ingresoCollection: IIngreso[] = [
            {
              ...ingreso,
            },
            { id: 456 },
          ];
          expectedResult = service.addIngresoToCollectionIfMissing(ingresoCollection, ingreso);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Ingreso to an array that doesn't contain it", () => {
          const ingreso: IIngreso = { id: 123 };
          const ingresoCollection: IIngreso[] = [{ id: 456 }];
          expectedResult = service.addIngresoToCollectionIfMissing(ingresoCollection, ingreso);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ingreso);
        });

        it('should add only unique Ingreso to an array', () => {
          const ingresoArray: IIngreso[] = [{ id: 123 }, { id: 456 }, { id: 50294 }];
          const ingresoCollection: IIngreso[] = [{ id: 123 }];
          expectedResult = service.addIngresoToCollectionIfMissing(ingresoCollection, ...ingresoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const ingreso: IIngreso = { id: 123 };
          const ingreso2: IIngreso = { id: 456 };
          expectedResult = service.addIngresoToCollectionIfMissing([], ingreso, ingreso2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(ingreso);
          expect(expectedResult).toContain(ingreso2);
        });

        it('should accept null and undefined values', () => {
          const ingreso: IIngreso = { id: 123 };
          expectedResult = service.addIngresoToCollectionIfMissing([], null, ingreso, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(ingreso);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
