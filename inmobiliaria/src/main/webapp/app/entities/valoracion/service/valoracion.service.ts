import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IValoracion, getValoracionIdentifier } from '../valoracion.model';

export type EntityResponseType = HttpResponse<IValoracion>;
export type EntityArrayResponseType = HttpResponse<IValoracion[]>;

@Injectable({ providedIn: 'root' })
export class ValoracionService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/valoracions');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(valoracion: IValoracion): Observable<EntityResponseType> {
    return this.http.post<IValoracion>(this.resourceUrl, valoracion, { observe: 'response' });
  }

  update(valoracion: IValoracion): Observable<EntityResponseType> {
    return this.http.put<IValoracion>(`${this.resourceUrl}/${getValoracionIdentifier(valoracion) as number}`, valoracion, {
      observe: 'response',
    });
  }

  partialUpdate(valoracion: IValoracion): Observable<EntityResponseType> {
    return this.http.patch<IValoracion>(`${this.resourceUrl}/${getValoracionIdentifier(valoracion) as number}`, valoracion, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IValoracion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IValoracion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addValoracionToCollectionIfMissing(
    valoracionCollection: IValoracion[],
    ...valoracionsToCheck: (IValoracion | null | undefined)[]
  ): IValoracion[] {
    const valoracions: IValoracion[] = valoracionsToCheck.filter(isPresent);
    if (valoracions.length > 0) {
      const valoracionCollectionIdentifiers = valoracionCollection.map(valoracionItem => getValoracionIdentifier(valoracionItem)!);
      const valoracionsToAdd = valoracions.filter(valoracionItem => {
        const valoracionIdentifier = getValoracionIdentifier(valoracionItem);
        if (valoracionIdentifier == null || valoracionCollectionIdentifiers.includes(valoracionIdentifier)) {
          return false;
        }
        valoracionCollectionIdentifiers.push(valoracionIdentifier);
        return true;
      });
      return [...valoracionsToAdd, ...valoracionCollection];
    }
    return valoracionCollection;
  }
}
