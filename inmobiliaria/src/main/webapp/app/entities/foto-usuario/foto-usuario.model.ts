import { IUsuarioEx } from 'app/entities/usuario-ex/usuario-ex.model';

export interface IFotoUsuario {
  id?: number;
  url?: string | null;
  usuarioEx?: IUsuarioEx | null;
}

export class FotoUsuario implements IFotoUsuario {
  constructor(public id?: number, public url?: string | null, public usuarioEx?: IUsuarioEx | null) {}
}

export function getFotoUsuarioIdentifier(fotoUsuario: IFotoUsuario): number | undefined {
  return fotoUsuario.id;
}
