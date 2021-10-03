import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICargo, getCargoIdentifier } from '../cargo.model';

export type EntityResponseType = HttpResponse<ICargo>;
export type EntityArrayResponseType = HttpResponse<ICargo[]>;

@Injectable({ providedIn: 'root' })
export class CargoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/cargos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(cargo: ICargo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cargo);
    return this.http
      .post<ICargo>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(cargo: ICargo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cargo);
    return this.http
      .put<ICargo>(`${this.resourceUrl}/${getCargoIdentifier(cargo) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(cargo: ICargo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cargo);
    return this.http
      .patch<ICargo>(`${this.resourceUrl}/${getCargoIdentifier(cargo) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICargo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICargo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCargoToCollectionIfMissing(cargoCollection: ICargo[], ...cargosToCheck: (ICargo | null | undefined)[]): ICargo[] {
    const cargos: ICargo[] = cargosToCheck.filter(isPresent);
    if (cargos.length > 0) {
      const cargoCollectionIdentifiers = cargoCollection.map(cargoItem => getCargoIdentifier(cargoItem)!);
      const cargosToAdd = cargos.filter(cargoItem => {
        const cargoIdentifier = getCargoIdentifier(cargoItem);
        if (cargoIdentifier == null || cargoCollectionIdentifiers.includes(cargoIdentifier)) {
          return false;
        }
        cargoCollectionIdentifiers.push(cargoIdentifier);
        return true;
      });
      return [...cargosToAdd, ...cargoCollection];
    }
    return cargoCollection;
  }

  protected convertDateFromClient(cargo: ICargo): ICargo {
    return Object.assign({}, cargo, {
      fechaCargo: cargo.fechaCargo?.isValid() ? cargo.fechaCargo.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaCargo = res.body.fechaCargo ? dayjs(res.body.fechaCargo) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((cargo: ICargo) => {
        cargo.fechaCargo = cargo.fechaCargo ? dayjs(cargo.fechaCargo) : undefined;
      });
    }
    return res;
  }
}
