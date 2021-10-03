import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIngreso, getIngresoIdentifier } from '../ingreso.model';

export type EntityResponseType = HttpResponse<IIngreso>;
export type EntityArrayResponseType = HttpResponse<IIngreso[]>;

@Injectable({ providedIn: 'root' })
export class IngresoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/ingresos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(ingreso: IIngreso): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ingreso);
    return this.http
      .post<IIngreso>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(ingreso: IIngreso): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ingreso);
    return this.http
      .put<IIngreso>(`${this.resourceUrl}/${getIngresoIdentifier(ingreso) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(ingreso: IIngreso): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ingreso);
    return this.http
      .patch<IIngreso>(`${this.resourceUrl}/${getIngresoIdentifier(ingreso) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IIngreso>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IIngreso[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addIngresoToCollectionIfMissing(ingresoCollection: IIngreso[], ...ingresosToCheck: (IIngreso | null | undefined)[]): IIngreso[] {
    const ingresos: IIngreso[] = ingresosToCheck.filter(isPresent);
    if (ingresos.length > 0) {
      const ingresoCollectionIdentifiers = ingresoCollection.map(ingresoItem => getIngresoIdentifier(ingresoItem)!);
      const ingresosToAdd = ingresos.filter(ingresoItem => {
        const ingresoIdentifier = getIngresoIdentifier(ingresoItem);
        if (ingresoIdentifier == null || ingresoCollectionIdentifiers.includes(ingresoIdentifier)) {
          return false;
        }
        ingresoCollectionIdentifiers.push(ingresoIdentifier);
        return true;
      });
      return [...ingresosToAdd, ...ingresoCollection];
    }
    return ingresoCollection;
  }

  protected convertDateFromClient(ingreso: IIngreso): IIngreso {
    return Object.assign({}, ingreso, {
      mes: ingreso.mes?.isValid() ? ingreso.mes.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.mes = res.body.mes ? dayjs(res.body.mes) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((ingreso: IIngreso) => {
        ingreso.mes = ingreso.mes ? dayjs(ingreso.mes) : undefined;
      });
    }
    return res;
  }
}
