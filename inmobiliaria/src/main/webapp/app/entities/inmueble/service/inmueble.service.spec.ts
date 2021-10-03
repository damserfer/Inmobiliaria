import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInmueble, Inmueble } from '../inmueble.model';

import { InmuebleService } from './inmueble.service';

describe('Service Tests', () => {
  describe('Inmueble Service', () => {
    let service: InmuebleService;
    let httpMock: HttpTestingController;
    let elemDefault: IInmueble;
    let expectedResult: IInmueble | IInmueble[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(InmuebleService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        calle: 'AAAAAAA',
        numero: 0,
        escalera: 0,
        codPostal: 0,
        ciudad: 'AAAAAAA',
        descripcion: 'AAAAAAA',
        nbanios: 0,
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

      it('should create a Inmueble', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Inmueble()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Inmueble', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            calle: 'BBBBBB',
            numero: 1,
            escalera: 1,
            codPostal: 1,
            ciudad: 'BBBBBB',
            descripcion: 'BBBBBB',
            nbanios: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Inmueble', () => {
        const patchObject = Object.assign(
          {
            calle: 'BBBBBB',
            ciudad: 'BBBBBB',
          },
          new Inmueble()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Inmueble', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            calle: 'BBBBBB',
            numero: 1,
            escalera: 1,
            codPostal: 1,
            ciudad: 'BBBBBB',
            descripcion: 'BBBBBB',
            nbanios: 1,
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

      it('should delete a Inmueble', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addInmuebleToCollectionIfMissing', () => {
        it('should add a Inmueble to an empty array', () => {
          const inmueble: IInmueble = { id: 123 };
          expectedResult = service.addInmuebleToCollectionIfMissing([], inmueble);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(inmueble);
        });

        it('should not add a Inmueble to an array that contains it', () => {
          const inmueble: IInmueble = { id: 123 };
          const inmuebleCollection: IInmueble[] = [
            {
              ...inmueble,
            },
            { id: 456 },
          ];
          expectedResult = service.addInmuebleToCollectionIfMissing(inmuebleCollection, inmueble);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Inmueble to an array that doesn't contain it", () => {
          const inmueble: IInmueble = { id: 123 };
          const inmuebleCollection: IInmueble[] = [{ id: 456 }];
          expectedResult = service.addInmuebleToCollectionIfMissing(inmuebleCollection, inmueble);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(inmueble);
        });

        it('should add only unique Inmueble to an array', () => {
          const inmuebleArray: IInmueble[] = [{ id: 123 }, { id: 456 }, { id: 90693 }];
          const inmuebleCollection: IInmueble[] = [{ id: 123 }];
          expectedResult = service.addInmuebleToCollectionIfMissing(inmuebleCollection, ...inmuebleArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const inmueble: IInmueble = { id: 123 };
          const inmueble2: IInmueble = { id: 456 };
          expectedResult = service.addInmuebleToCollectionIfMissing([], inmueble, inmueble2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(inmueble);
          expect(expectedResult).toContain(inmueble2);
        });

        it('should accept null and undefined values', () => {
          const inmueble: IInmueble = { id: 123 };
          expectedResult = service.addInmuebleToCollectionIfMissing([], null, inmueble, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(inmueble);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
