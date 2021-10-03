import * as dayjs from 'dayjs';
import { ICargo } from 'app/entities/cargo/cargo.model';

export interface IIngreso {
  id?: number;
  mes?: dayjs.Dayjs | null;
  concepto?: string | null;
  cantidad?: number | null;
  cargo?: ICargo | null;
}

export class Ingreso implements IIngreso {
  constructor(
    public id?: number,
    public mes?: dayjs.Dayjs | null,
    public concepto?: string | null,
    public cantidad?: number | null,
    public cargo?: ICargo | null
  ) {}
}

export function getIngresoIdentifier(ingreso: IIngreso): number | undefined {
  return ingreso.id;
}
