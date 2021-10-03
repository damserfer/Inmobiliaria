import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUsuarioEx, UsuarioEx } from '../usuario-ex.model';

import { UsuarioExService } from './usuario-ex.service';

describe('Service Tests', () => {
  describe('UsuarioEx Service', () => {
    let service: UsuarioExService;
    let httpMock: HttpTestingController;
    let elemDefault: IUsuarioEx;
    let expectedResult: IUsuarioEx | IUsuarioEx[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(UsuarioExService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        dni: 'AAAAAAA',
        nombre: 'AAAAAAA',
        apellidos: 'AAAAAAA',
        password: 'AAAAAAA',
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

      it('should create a UsuarioEx', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new UsuarioEx()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a UsuarioEx', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dni: 'BBBBBB',
            nombre: 'BBBBBB',
            apellidos: 'BBBBBB',
            password: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a UsuarioEx', () => {
        const patchObject = Object.assign(
          {
            nombre: 'BBBBBB',
            apellidos: 'BBBBBB',
          },
          new UsuarioEx()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of UsuarioEx', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            dni: 'BBBBBB',
            nombre: 'BBBBBB',
            apellidos: 'BBBBBB',
            password: 'BBBBBB',
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

      it('should delete a UsuarioEx', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addUsuarioExToCollectionIfMissing', () => {
        it('should add a UsuarioEx to an empty array', () => {
          const usuarioEx: IUsuarioEx = { id: 123 };
          expectedResult = service.addUsuarioExToCollectionIfMissing([], usuarioEx);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(usuarioEx);
        });

        it('should not add a UsuarioEx to an array that contains it', () => {
          const usuarioEx: IUsuarioEx = { id: 123 };
          const usuarioExCollection: IUsuarioEx[] = [
            {
              ...usuarioEx,
            },
            { id: 456 },
          ];
          expectedResult = service.addUsuarioExToCollectionIfMissing(usuarioExCollection, usuarioEx);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a UsuarioEx to an array that doesn't contain it", () => {
          const usuarioEx: IUsuarioEx = { id: 123 };
          const usuarioExCollection: IUsuarioEx[] = [{ id: 456 }];
          expectedResult = service.addUsuarioExToCollectionIfMissing(usuarioExCollection, usuarioEx);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(usuarioEx);
        });

        it('should add only unique UsuarioEx to an array', () => {
          const usuarioExArray: IUsuarioEx[] = [{ id: 123 }, { id: 456 }, { id: 83068 }];
          const usuarioExCollection: IUsuarioEx[] = [{ id: 123 }];
          expectedResult = service.addUsuarioExToCollectionIfMissing(usuarioExCollection, ...usuarioExArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const usuarioEx: IUsuarioEx = { id: 123 };
          const usuarioEx2: IUsuarioEx = { id: 456 };
          expectedResult = service.addUsuarioExToCollectionIfMissing([], usuarioEx, usuarioEx2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(usuarioEx);
          expect(expectedResult).toContain(usuarioEx2);
        });

        it('should accept null and undefined values', () => {
          const usuarioEx: IUsuarioEx = { id: 123 };
          expectedResult = service.addUsuarioExToCollectionIfMissing([], null, usuarioEx, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(usuarioEx);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
