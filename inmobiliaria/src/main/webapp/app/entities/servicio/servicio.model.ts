import { IInmueble } from 'app/entities/inmueble/inmueble.model';
import { IEmpresa } from 'app/entities/empresa/empresa.model';

export interface IServicio {
  id?: number;
  nombre?: string | null;
  precioHoras?: number | null;
  horas?: number | null;
  inmueble?: IInmueble | null;
  empresa?: IEmpresa | null;
}

export class Servicio implements IServicio {
  constructor(
    public id?: number,
    public nombre?: string | null,
    public precioHoras?: number | null,
    public horas?: number | null,
    public inmueble?: IInmueble | null,
    public empresa?: IEmpresa | null
  ) {}
}

export function getServicioIdentifier(servicio: IServicio): number | undefined {
  return servicio.id;
}
