import * as dayjs from 'dayjs';
import { IIngreso } from 'app/entities/ingreso/ingreso.model';
import { IContrato } from 'app/entities/contrato/contrato.model';
import { Mes } from 'app/entities/enumerations/mes.model';
import { Concepto } from 'app/entities/enumerations/concepto.model';

export interface ICargo {
  id?: number;
  fechaCargo?: dayjs.Dayjs | null;
  mes?: Mes | null;
  ejercicio?: number | null;
  importeTotal?: number | null;
  pagado?: boolean | null;
  concepto?: Concepto | null;
  ingreso?: IIngreso | null;
  contrato?: IContrato | null;
}

export class Cargo implements ICargo {
  constructor(
    public id?: number,
    public fechaCargo?: dayjs.Dayjs | null,
    public mes?: Mes | null,
    public ejercicio?: number | null,
    public importeTotal?: number | null,
    public pagado?: boolean | null,
    public concepto?: Concepto | null,
    public ingreso?: IIngreso | null,
    public contrato?: IContrato | null
  ) {
    this.pagado = this.pagado ?? false;
  }
}

export function getCargoIdentifier(cargo: ICargo): number | undefined {
  return cargo.id;
}
