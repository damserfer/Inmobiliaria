import { IContrato } from 'app/entities/contrato/contrato.model';

export interface IValoracion {
  id?: number;
  comentario?: string | null;
  puntuacion?: number | null;
  contrato?: IContrato | null;
}

export class Valoracion implements IValoracion {
  constructor(
    public id?: number,
    public comentario?: string | null,
    public puntuacion?: number | null,
    public contrato?: IContrato | null
  ) {}
}

export function getValoracionIdentifier(valoracion: IValoracion): number | undefined {
  return valoracion.id;
}
