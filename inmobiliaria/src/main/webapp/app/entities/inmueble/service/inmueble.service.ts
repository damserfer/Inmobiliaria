import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInmueble, getInmuebleIdentifier } from '../inmueble.model';

export type EntityResponseType = HttpResponse<IInmueble>;
export type EntityArrayResponseType = HttpResponse<IInmueble[]>;

@Injectable({ providedIn: 'root' })
export class InmuebleService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/inmuebles');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(inmueble: IInmueble): Observable<EntityResponseType> {
    return this.http.post<IInmueble>(this.resourceUrl, inmueble, { observe: 'response' });
  }

  update(inmueble: IInmueble): Observable<EntityResponseType> {
    return this.http.put<IInmueble>(`${this.resourceUrl}/${getInmuebleIdentifier(inmueble) as number}`, inmueble, { observe: 'response' });
  }

  partialUpdate(inmueble: IInmueble): Observable<EntityResponseType> {
    return this.http.patch<IInmueble>(`${this.resourceUrl}/${getInmuebleIdentifier(inmueble) as number}`, inmueble, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInmueble>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInmueble[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addInmuebleToCollectionIfMissing(inmuebleCollection: IInmueble[], ...inmueblesToCheck: (IInmueble | null | undefined)[]): IInmueble[] {
    const inmuebles: IInmueble[] = inmueblesToCheck.filter(isPresent);
    if (inmuebles.length > 0) {
      const inmuebleCollectionIdentifiers = inmuebleCollection.map(inmuebleItem => getInmuebleIdentifier(inmuebleItem)!);
      const inmueblesToAdd = inmuebles.filter(inmuebleItem => {
        const inmuebleIdentifier = getInmuebleIdentifier(inmuebleItem);
        if (inmuebleIdentifier == null || inmuebleCollectionIdentifiers.includes(inmuebleIdentifier)) {
          return false;
        }
        inmuebleCollectionIdentifiers.push(inmuebleIdentifier);
        return true;
      });
      return [...inmueblesToAdd, ...inmuebleCollection];
    }
    return inmuebleCollection;
  }
}
