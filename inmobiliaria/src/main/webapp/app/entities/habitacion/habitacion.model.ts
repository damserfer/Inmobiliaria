import { IFotoHabitacion } from 'app/entities/foto-habitacion/foto-habitacion.model';
import { IInmueble } from 'app/entities/inmueble/inmueble.model';

export interface IHabitacion {
  id?: number;
  precio?: number | null;
  descripcion?: string | null;
  fotoHabitacions?: IFotoHabitacion[] | null;
  inmueble?: IInmueble | null;
}

export class Habitacion implements IHabitacion {
  constructor(
    public id?: number,
    public precio?: number | null,
    public descripcion?: string | null,
    public fotoHabitacions?: IFotoHabitacion[] | null,
    public inmueble?: IInmueble | null
  ) {}
}

export function getHabitacionIdentifier(habitacion: IHabitacion): number | undefined {
  return habitacion.id;
}
