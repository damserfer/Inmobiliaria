import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHabitacion, getHabitacionIdentifier } from '../habitacion.model';

export type EntityResponseType = HttpResponse<IHabitacion>;
export type EntityArrayResponseType = HttpResponse<IHabitacion[]>;

@Injectable({ providedIn: 'root' })
export class HabitacionService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/habitacions');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(habitacion: IHabitacion): Observable<EntityResponseType> {
    return this.http.post<IHabitacion>(this.resourceUrl, habitacion, { observe: 'response' });
  }

  update(habitacion: IHabitacion): Observable<EntityResponseType> {
    return this.http.put<IHabitacion>(`${this.resourceUrl}/${getHabitacionIdentifier(habitacion) as number}`, habitacion, {
      observe: 'response',
    });
  }

  partialUpdate(habitacion: IHabitacion): Observable<EntityResponseType> {
    return this.http.patch<IHabitacion>(`${this.resourceUrl}/${getHabitacionIdentifier(habitacion) as number}`, habitacion, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHabitacion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHabitacion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addHabitacionToCollectionIfMissing(
    habitacionCollection: IHabitacion[],
    ...habitacionsToCheck: (IHabitacion | null | undefined)[]
  ): IHabitacion[] {
    const habitacions: IHabitacion[] = habitacionsToCheck.filter(isPresent);
    if (habitacions.length > 0) {
      const habitacionCollectionIdentifiers = habitacionCollection.map(habitacionItem => getHabitacionIdentifier(habitacionItem)!);
      const habitacionsToAdd = habitacions.filter(habitacionItem => {
        const habitacionIdentifier = getHabitacionIdentifier(habitacionItem);
        if (habitacionIdentifier == null || habitacionCollectionIdentifiers.includes(habitacionIdentifier)) {
          return false;
        }
        habitacionCollectionIdentifiers.push(habitacionIdentifier);
        return true;
      });
      return [...habitacionsToAdd, ...habitacionCollection];
    }
    return habitacionCollection;
  }
}
