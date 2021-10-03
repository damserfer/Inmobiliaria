import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFotoUsuario, getFotoUsuarioIdentifier } from '../foto-usuario.model';

export type EntityResponseType = HttpResponse<IFotoUsuario>;
export type EntityArrayResponseType = HttpResponse<IFotoUsuario[]>;

@Injectable({ providedIn: 'root' })
export class FotoUsuarioService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/foto-usuarios');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(fotoUsuario: IFotoUsuario): Observable<EntityResponseType> {
    return this.http.post<IFotoUsuario>(this.resourceUrl, fotoUsuario, { observe: 'response' });
  }

  update(fotoUsuario: IFotoUsuario): Observable<EntityResponseType> {
    return this.http.put<IFotoUsuario>(`${this.resourceUrl}/${getFotoUsuarioIdentifier(fotoUsuario) as number}`, fotoUsuario, {
      observe: 'response',
    });
  }

  partialUpdate(fotoUsuario: IFotoUsuario): Observable<EntityResponseType> {
    return this.http.patch<IFotoUsuario>(`${this.resourceUrl}/${getFotoUsuarioIdentifier(fotoUsuario) as number}`, fotoUsuario, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFotoUsuario>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFotoUsuario[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFotoUsuarioToCollectionIfMissing(
    fotoUsuarioCollection: IFotoUsuario[],
    ...fotoUsuariosToCheck: (IFotoUsuario | null | undefined)[]
  ): IFotoUsuario[] {
    const fotoUsuarios: IFotoUsuario[] = fotoUsuariosToCheck.filter(isPresent);
    if (fotoUsuarios.length > 0) {
      const fotoUsuarioCollectionIdentifiers = fotoUsuarioCollection.map(fotoUsuarioItem => getFotoUsuarioIdentifier(fotoUsuarioItem)!);
      const fotoUsuariosToAdd = fotoUsuarios.filter(fotoUsuarioItem => {
        const fotoUsuarioIdentifier = getFotoUsuarioIdentifier(fotoUsuarioItem);
        if (fotoUsuarioIdentifier == null || fotoUsuarioCollectionIdentifiers.includes(fotoUsuarioIdentifier)) {
          return false;
        }
        fotoUsuarioCollectionIdentifiers.push(fotoUsuarioIdentifier);
        return true;
      });
      return [...fotoUsuariosToAdd, ...fotoUsuarioCollection];
    }
    return fotoUsuarioCollection;
  }
}
