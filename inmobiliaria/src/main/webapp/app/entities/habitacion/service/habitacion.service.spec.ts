import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHabitacion, Habitacion } from '../habitacion.model';

import { HabitacionService } from './habitacion.service';

describe('Service Tests', () => {
  describe('Habitacion Service', () => {
    let service: HabitacionService;
    let httpMock: HttpTestingController;
    let elemDefault: IHabitacion;
    let expectedResult: IHabitacion | IHabitacion[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(HabitacionService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        precio: 0,
        descripcion: 'AAAAAAA',
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

      it('should create a Habitacion', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Habitacion()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Habitacion', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            precio: 1,
            descripcion: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Habitacion', () => {
        const patchObject = Object.assign(
          {
            precio: 1,
            descripcion: 'BBBBBB',
          },
          new Habitacion()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Habitacion', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            precio: 1,
            descripcion: 'BBBBBB',
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

      it('should delete a Habitacion', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addHabitacionToCollectionIfMissing', () => {
        it('should add a Habitacion to an empty array', () => {
          const habitacion: IHabitacion = { id: 123 };
          expectedResult = service.addHabitacionToCollectionIfMissing([], habitacion);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(habitacion);
        });

        it('should not add a Habitacion to an array that contains it', () => {
          const habitacion: IHabitacion = { id: 123 };
          const habitacionCollection: IHabitacion[] = [
            {
              ...habitacion,
            },
            { id: 456 },
          ];
          expectedResult = service.addHabitacionToCollectionIfMissing(habitacionCollection, habitacion);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Habitacion to an array that doesn't contain it", () => {
          const habitacion: IHabitacion = { id: 123 };
          const habitacionCollection: IHabitacion[] = [{ id: 456 }];
          expectedResult = service.addHabitacionToCollectionIfMissing(habitacionCollection, habitacion);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(habitacion);
        });

        it('should add only unique Habitacion to an array', () => {
          const habitacionArray: IHabitacion[] = [{ id: 123 }, { id: 456 }, { id: 69713 }];
          const habitacionCollection: IHabitacion[] = [{ id: 123 }];
          expectedResult = service.addHabitacionToCollectionIfMissing(habitacionCollection, ...habitacionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const habitacion: IHabitacion = { id: 123 };
          const habitacion2: IHabitacion = { id: 456 };
          expectedResult = service.addHabitacionToCollectionIfMissing([], habitacion, habitacion2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(habitacion);
          expect(expectedResult).toContain(habitacion2);
        });

        it('should accept null and undefined values', () => {
          const habitacion: IHabitacion = { id: 123 };
          expectedResult = service.addHabitacionToCollectionIfMissing([], null, habitacion, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(habitacion);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
