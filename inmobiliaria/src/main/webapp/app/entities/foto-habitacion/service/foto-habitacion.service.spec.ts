import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFotoHabitacion, FotoHabitacion } from '../foto-habitacion.model';

import { FotoHabitacionService } from './foto-habitacion.service';

describe('Service Tests', () => {
  describe('FotoHabitacion Service', () => {
    let service: FotoHabitacionService;
    let httpMock: HttpTestingController;
    let elemDefault: IFotoHabitacion;
    let expectedResult: IFotoHabitacion | IFotoHabitacion[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FotoHabitacionService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        url: 'AAAAAAA',
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

      it('should create a FotoHabitacion', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new FotoHabitacion()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a FotoHabitacion', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            url: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a FotoHabitacion', () => {
        const patchObject = Object.assign({}, new FotoHabitacion());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of FotoHabitacion', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            url: 'BBBBBB',
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

      it('should delete a FotoHabitacion', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFotoHabitacionToCollectionIfMissing', () => {
        it('should add a FotoHabitacion to an empty array', () => {
          const fotoHabitacion: IFotoHabitacion = { id: 123 };
          expectedResult = service.addFotoHabitacionToCollectionIfMissing([], fotoHabitacion);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(fotoHabitacion);
        });

        it('should not add a FotoHabitacion to an array that contains it', () => {
          const fotoHabitacion: IFotoHabitacion = { id: 123 };
          const fotoHabitacionCollection: IFotoHabitacion[] = [
            {
              ...fotoHabitacion,
            },
            { id: 456 },
          ];
          expectedResult = service.addFotoHabitacionToCollectionIfMissing(fotoHabitacionCollection, fotoHabitacion);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a FotoHabitacion to an array that doesn't contain it", () => {
          const fotoHabitacion: IFotoHabitacion = { id: 123 };
          const fotoHabitacionCollection: IFotoHabitacion[] = [{ id: 456 }];
          expectedResult = service.addFotoHabitacionToCollectionIfMissing(fotoHabitacionCollection, fotoHabitacion);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(fotoHabitacion);
        });

        it('should add only unique FotoHabitacion to an array', () => {
          const fotoHabitacionArray: IFotoHabitacion[] = [{ id: 123 }, { id: 456 }, { id: 91984 }];
          const fotoHabitacionCollection: IFotoHabitacion[] = [{ id: 123 }];
          expectedResult = service.addFotoHabitacionToCollectionIfMissing(fotoHabitacionCollection, ...fotoHabitacionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const fotoHabitacion: IFotoHabitacion = { id: 123 };
          const fotoHabitacion2: IFotoHabitacion = { id: 456 };
          expectedResult = service.addFotoHabitacionToCollectionIfMissing([], fotoHabitacion, fotoHabitacion2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(fotoHabitacion);
          expect(expectedResult).toContain(fotoHabitacion2);
        });

        it('should accept null and undefined values', () => {
          const fotoHabitacion: IFotoHabitacion = { id: 123 };
          expectedResult = service.addFotoHabitacionToCollectionIfMissing([], null, fotoHabitacion, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(fotoHabitacion);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
