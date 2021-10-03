import * as dayjs from 'dayjs';
import { IValoracion } from 'app/entities/valoracion/valoracion.model';
import { ICargo } from 'app/entities/cargo/cargo.model';
import { IUsuarioEx } from 'app/entities/usuario-ex/usuario-ex.model';
import { IInmueble } from 'app/entities/inmueble/inmueble.model';

export interface IContrato {
  id?: number;
  fechaInicio?: dayjs.Dayjs | null;
  fechaFin?: dayjs.Dayjs | null;
  precioAlquiler?: dayjs.Dayjs | null;
  valoracions?: IValoracion[] | null;
  cargos?: ICargo[] | null;
  usuarioEx?: IUsuarioEx | null;
  inmueble?: IInmueble | null;
}

export class Contrato implements IContrato {
  constructor(
    public id?: number,
    public fechaInicio?: dayjs.Dayjs | null,
    public fechaFin?: dayjs.Dayjs | null,
    public precioAlquiler?: dayjs.Dayjs | null,
    public valoracions?: IValoracion[] | null,
    public cargos?: ICargo[] | null,
    public usuarioEx?: IUsuarioEx | null,
    public inmueble?: IInmueble | null
  ) {}
}

export function getContratoIdentifier(contrato: IContrato): number | undefined {
  return contrato.id;
}
