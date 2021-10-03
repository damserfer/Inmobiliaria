import { IFotoUsuario } from 'app/entities/foto-usuario/foto-usuario.model';
import { IInmueble } from 'app/entities/inmueble/inmueble.model';
import { IContrato } from 'app/entities/contrato/contrato.model';

export interface IUsuarioEx {
  id?: number;
  dni?: string | null;
  nombre?: string | null;
  apellidos?: string | null;
  password?: string | null;
  fotoUsuarios?: IFotoUsuario[] | null;
  inmuebles?: IInmueble[] | null;
  contratoes?: IContrato[] | null;
}

export class UsuarioEx implements IUsuarioEx {
  constructor(
    public id?: number,
    public dni?: string | null,
    public nombre?: string | null,
    public apellidos?: string | null,
    public password?: string | null,
    public fotoUsuarios?: IFotoUsuario[] | null,
    public inmuebles?: IInmueble[] | null,
    public contratoes?: IContrato[] | null
  ) {}
}

export function getUsuarioExIdentifier(usuarioEx: IUsuarioEx): number | undefined {
  return usuarioEx.id;
}
