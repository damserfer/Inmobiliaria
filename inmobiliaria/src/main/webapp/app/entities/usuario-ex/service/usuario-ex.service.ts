import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUsuarioEx, getUsuarioExIdentifier } from '../usuario-ex.model';

export type EntityResponseType = HttpResponse<IUsuarioEx>;
export type EntityArrayResponseType = HttpResponse<IUsuarioEx[]>;

@Injectable({ providedIn: 'root' })
export class UsuarioExService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/usuario-exes');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(usuarioEx: IUsuarioEx): Observable<EntityResponseType> {
    return this.http.post<IUsuarioEx>(this.resourceUrl, usuarioEx, { observe: 'response' });
  }

  update(usuarioEx: IUsuarioEx): Observable<EntityResponseType> {
    return this.http.put<IUsuarioEx>(`${this.resourceUrl}/${getUsuarioExIdentifier(usuarioEx) as number}`, usuarioEx, {
      observe: 'response',
    });
  }

  partialUpdate(usuarioEx: IUsuarioEx): Observable<EntityResponseType> {
    return this.http.patch<IUsuarioEx>(`${this.resourceUrl}/${getUsuarioExIdentifier(usuarioEx) as number}`, usuarioEx, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUsuarioEx>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUsuarioEx[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUsuarioExToCollectionIfMissing(
    usuarioExCollection: IUsuarioEx[],
    ...usuarioExesToCheck: (IUsuarioEx | null | undefined)[]
  ): IUsuarioEx[] {
    const usuarioExes: IUsuarioEx[] = usuarioExesToCheck.filter(isPresent);
    if (usuarioExes.length > 0) {
      const usuarioExCollectionIdentifiers = usuarioExCollection.map(usuarioExItem => getUsuarioExIdentifier(usuarioExItem)!);
      const usuarioExesToAdd = usuarioExes.filter(usuarioExItem => {
        const usuarioExIdentifier = getUsuarioExIdentifier(usuarioExItem);
        if (usuarioExIdentifier == null || usuarioExCollectionIdentifiers.includes(usuarioExIdentifier)) {
          return false;
        }
        usuarioExCollectionIdentifiers.push(usuarioExIdentifier);
        return true;
      });
      return [...usuarioExesToAdd, ...usuarioExCollection];
    }
    return usuarioExCollection;
  }
}
