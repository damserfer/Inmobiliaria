import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFotoHabitacion, getFotoHabitacionIdentifier } from '../foto-habitacion.model';

export type EntityResponseType = HttpResponse<IFotoHabitacion>;
export type EntityArrayResponseType = HttpResponse<IFotoHabitacion[]>;

@Injectable({ providedIn: 'root' })
export class FotoHabitacionService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/foto-habitacions');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(fotoHabitacion: IFotoHabitacion): Observable<EntityResponseType> {
    return this.http.post<IFotoHabitacion>(this.resourceUrl, fotoHabitacion, { observe: 'response' });
  }

  update(fotoHabitacion: IFotoHabitacion): Observable<EntityResponseType> {
    return this.http.put<IFotoHabitacion>(`${this.resourceUrl}/${getFotoHabitacionIdentifier(fotoHabitacion) as number}`, fotoHabitacion, {
      observe: 'response',
    });
  }

  partialUpdate(fotoHabitacion: IFotoHabitacion): Observable<EntityResponseType> {
    return this.http.patch<IFotoHabitacion>(
      `${this.resourceUrl}/${getFotoHabitacionIdentifier(fotoHabitacion) as number}`,
      fotoHabitacion,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFotoHabitacion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFotoHabitacion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFotoHabitacionToCollectionIfMissing(
    fotoHabitacionCollection: IFotoHabitacion[],
    ...fotoHabitacionsToCheck: (IFotoHabitacion | null | undefined)[]
  ): IFotoHabitacion[] {
    const fotoHabitacions: IFotoHabitacion[] = fotoHabitacionsToCheck.filter(isPresent);
    if (fotoHabitacions.length > 0) {
      const fotoHabitacionCollectionIdentifiers = fotoHabitacionCollection.map(
        fotoHabitacionItem => getFotoHabitacionIdentifier(fotoHabitacionItem)!
      );
      const fotoHabitacionsToAdd = fotoHabitacions.filter(fotoHabitacionItem => {
        const fotoHabitacionIdentifier = getFotoHabitacionIdentifier(fotoHabitacionItem);
        if (fotoHabitacionIdentifier == null || fotoHabitacionCollectionIdentifiers.includes(fotoHabitacionIdentifier)) {
          return false;
        }
        fotoHabitacionCollectionIdentifiers.push(fotoHabitacionIdentifier);
        return true;
      });
      return [...fotoHabitacionsToAdd, ...fotoHabitacionCollection];
    }
    return fotoHabitacionCollection;
  }
}
