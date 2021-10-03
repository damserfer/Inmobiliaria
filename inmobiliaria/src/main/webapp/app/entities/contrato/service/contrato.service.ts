import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IContrato, getContratoIdentifier } from '../contrato.model';

export type EntityResponseType = HttpResponse<IContrato>;
export type EntityArrayResponseType = HttpResponse<IContrato[]>;

@Injectable({ providedIn: 'root' })
export class ContratoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/contratoes');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(contrato: IContrato): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contrato);
    return this.http
      .post<IContrato>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(contrato: IContrato): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contrato);
    return this.http
      .put<IContrato>(`${this.resourceUrl}/${getContratoIdentifier(contrato) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(contrato: IContrato): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contrato);
    return this.http
      .patch<IContrato>(`${this.resourceUrl}/${getContratoIdentifier(contrato) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IContrato>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IContrato[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addContratoToCollectionIfMissing(contratoCollection: IContrato[], ...contratoesToCheck: (IContrato | null | undefined)[]): IContrato[] {
    const contratoes: IContrato[] = contratoesToCheck.filter(isPresent);
    if (contratoes.length > 0) {
      const contratoCollectionIdentifiers = contratoCollection.map(contratoItem => getContratoIdentifier(contratoItem)!);
      const contratoesToAdd = contratoes.filter(contratoItem => {
        const contratoIdentifier = getContratoIdentifier(contratoItem);
        if (contratoIdentifier == null || contratoCollectionIdentifiers.includes(contratoIdentifier)) {
          return false;
        }
        contratoCollectionIdentifiers.push(contratoIdentifier);
        return true;
      });
      return [...contratoesToAdd, ...contratoCollection];
    }
    return contratoCollection;
  }

  protected convertDateFromClient(contrato: IContrato): IContrato {
    return Object.assign({}, contrato, {
      fechaInicio: contrato.fechaInicio?.isValid() ? contrato.fechaInicio.format(DATE_FORMAT) : undefined,
      fechaFin: contrato.fechaFin?.isValid() ? contrato.fechaFin.format(DATE_FORMAT) : undefined,
      precioAlquiler: contrato.precioAlquiler?.isValid() ? contrato.precioAlquiler.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaInicio = res.body.fechaInicio ? dayjs(res.body.fechaInicio) : undefined;
      res.body.fechaFin = res.body.fechaFin ? dayjs(res.body.fechaFin) : undefined;
      res.body.precioAlquiler = res.body.precioAlquiler ? dayjs(res.body.precioAlquiler) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((contrato: IContrato) => {
        contrato.fechaInicio = contrato.fechaInicio ? dayjs(contrato.fechaInicio) : undefined;
        contrato.fechaFin = contrato.fechaFin ? dayjs(contrato.fechaFin) : undefined;
        contrato.precioAlquiler = contrato.precioAlquiler ? dayjs(contrato.precioAlquiler) : undefined;
      });
    }
    return res;
  }
}
