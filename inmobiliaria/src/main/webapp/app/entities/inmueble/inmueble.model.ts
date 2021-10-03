import { IHabitacion } from 'app/entities/habitacion/habitacion.model';
import { IContrato } from 'app/entities/contrato/contrato.model';
import { IServicio } from 'app/entities/servicio/servicio.model';
import { IUsuarioEx } from 'app/entities/usuario-ex/usuario-ex.model';

export interface IInmueble {
  id?: number;
  calle?: string | null;
  numero?: number | null;
  escalera?: number | null;
  codPostal?: number | null;
  ciudad?: string | null;
  descripcion?: string | null;
  nbanios?: number | null;
  habitacions?: IHabitacion[] | null;
  contratoes?: IContrato[] | null;
  servicios?: IServicio[] | null;
  usuarioEx?: IUsuarioEx | null;
}

export class Inmueble implements IInmueble {
  constructor(
    public id?: number,
    public calle?: string | null,
    public numero?: number | null,
    public escalera?: number | null,
    public codPostal?: number | null,
    public ciudad?: string | null,
    public descripcion?: string | null,
    public nbanios?: number | null,
    public habitacions?: IHabitacion[] | null,
    public contratoes?: IContrato[] | null,
    public servicios?: IServicio[] | null,
    public usuarioEx?: IUsuarioEx | null
  ) {}
}

export function getInmuebleIdentifier(inmueble: IInmueble): number | undefined {
  return inmueble.id;
}
