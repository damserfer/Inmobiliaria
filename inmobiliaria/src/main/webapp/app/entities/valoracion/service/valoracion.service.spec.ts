import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IValoracion, Valoracion } from '../valoracion.model';

import { ValoracionService } from './valoracion.service';

describe('Service Tests', () => {
  describe('Valoracion Service', () => {
    let service: ValoracionService;
    let httpMock: HttpTestingController;
    let elemDefault: IValoracion;
    let expectedResult: IValoracion | IValoracion[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ValoracionService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        comentario: 'AAAAAAA',
        puntuacion: 0,
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

      it('should create a Valoracion', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Valoracion()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Valoracion', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            comentario: 'BBBBBB',
            puntuacion: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Valoracion', () => {
        const patchObject = Object.assign(
          {
            comentario: 'BBBBBB',
          },
          new Valoracion()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Valoracion', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            comentario: 'BBBBBB',
            puntuacion: 1,
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

      it('should delete a Valoracion', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addValoracionToCollectionIfMissing', () => {
        it('should add a Valoracion to an empty array', () => {
          const valoracion: IValoracion = { id: 123 };
          expectedResult = service.addValoracionToCollectionIfMissing([], valoracion);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(valoracion);
        });

        it('should not add a Valoracion to an array that contains it', () => {
          const valoracion: IValoracion = { id: 123 };
          const valoracionCollection: IValoracion[] = [
            {
              ...valoracion,
            },
            { id: 456 },
          ];
          expectedResult = service.addValoracionToCollectionIfMissing(valoracionCollection, valoracion);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Valoracion to an array that doesn't contain it", () => {
          const valoracion: IValoracion = { id: 123 };
          const valoracionCollection: IValoracion[] = [{ id: 456 }];
          expectedResult = service.addValoracionToCollectionIfMissing(valoracionCollection, valoracion);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(valoracion);
        });

        it('should add only unique Valoracion to an array', () => {
          const valoracionArray: IValoracion[] = [{ id: 123 }, { id: 456 }, { id: 41335 }];
          const valoracionCollection: IValoracion[] = [{ id: 123 }];
          expectedResult = service.addValoracionToCollectionIfMissing(valoracionCollection, ...valoracionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const valoracion: IValoracion = { id: 123 };
          const valoracion2: IValoracion = { id: 456 };
          expectedResult = service.addValoracionToCollectionIfMissing([], valoracion, valoracion2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(valoracion);
          expect(expectedResult).toContain(valoracion2);
        });

        it('should accept null and undefined values', () => {
          const valoracion: IValoracion = { id: 123 };
          expectedResult = service.addValoracionToCollectionIfMissing([], null, valoracion, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(valoracion);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
