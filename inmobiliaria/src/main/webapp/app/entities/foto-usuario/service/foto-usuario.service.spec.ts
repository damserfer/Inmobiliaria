import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFotoUsuario, FotoUsuario } from '../foto-usuario.model';

import { FotoUsuarioService } from './foto-usuario.service';

describe('Service Tests', () => {
  describe('FotoUsuario Service', () => {
    let service: FotoUsuarioService;
    let httpMock: HttpTestingController;
    let elemDefault: IFotoUsuario;
    let expectedResult: IFotoUsuario | IFotoUsuario[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FotoUsuarioService);
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

      it('should create a FotoUsuario', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new FotoUsuario()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a FotoUsuario', () => {
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

      it('should partial update a FotoUsuario', () => {
        const patchObject = Object.assign({}, new FotoUsuario());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of FotoUsuario', () => {
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

      it('should delete a FotoUsuario', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFotoUsuarioToCollectionIfMissing', () => {
        it('should add a FotoUsuario to an empty array', () => {
          const fotoUsuario: IFotoUsuario = { id: 123 };
          expectedResult = service.addFotoUsuarioToCollectionIfMissing([], fotoUsuario);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(fotoUsuario);
        });

        it('should not add a FotoUsuario to an array that contains it', () => {
          const fotoUsuario: IFotoUsuario = { id: 123 };
          const fotoUsuarioCollection: IFotoUsuario[] = [
            {
              ...fotoUsuario,
            },
            { id: 456 },
          ];
          expectedResult = service.addFotoUsuarioToCollectionIfMissing(fotoUsuarioCollection, fotoUsuario);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a FotoUsuario to an array that doesn't contain it", () => {
          const fotoUsuario: IFotoUsuario = { id: 123 };
          const fotoUsuarioCollection: IFotoUsuario[] = [{ id: 456 }];
          expectedResult = service.addFotoUsuarioToCollectionIfMissing(fotoUsuarioCollection, fotoUsuario);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(fotoUsuario);
        });

        it('should add only unique FotoUsuario to an array', () => {
          const fotoUsuarioArray: IFotoUsuario[] = [{ id: 123 }, { id: 456 }, { id: 92149 }];
          const fotoUsuarioCollection: IFotoUsuario[] = [{ id: 123 }];
          expectedResult = service.addFotoUsuarioToCollectionIfMissing(fotoUsuarioCollection, ...fotoUsuarioArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const fotoUsuario: IFotoUsuario = { id: 123 };
          const fotoUsuario2: IFotoUsuario = { id: 456 };
          expectedResult = service.addFotoUsuarioToCollectionIfMissing([], fotoUsuario, fotoUsuario2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(fotoUsuario);
          expect(expectedResult).toContain(fotoUsuario2);
        });

        it('should accept null and undefined values', () => {
          const fotoUsuario: IFotoUsuario = { id: 123 };
          expectedResult = service.addFotoUsuarioToCollectionIfMissing([], null, fotoUsuario, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(fotoUsuario);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
