import { IHabitacion } from 'app/entities/habitacion/habitacion.model';

export interface IFotoHabitacion {
  id?: number;
  url?: string | null;
  habitacion?: IHabitacion | null;
}

export class FotoHabitacion implements IFotoHabitacion {
  constructor(public id?: number, public url?: string | null, public habitacion?: IHabitacion | null) {}
}

export function getFotoHabitacionIdentifier(fotoHabitacion: IFotoHabitacion): number | undefined {
  return fotoHabitacion.id;
}
