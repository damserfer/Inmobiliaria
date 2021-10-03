import { IServicio } from 'app/entities/servicio/servicio.model';

export interface IEmpresa {
  id?: number;
  cif?: string | null;
  nombre?: string | null;
  calle?: string | null;
  numero?: number | null;
  ciudad?: string | null;
  web?: string | null;
  telefono?: string | null;
  servicios?: IServicio[] | null;
}

export class Empresa implements IEmpresa {
  constructor(
    public id?: number,
    public cif?: string | null,
    public nombre?: string | null,
    public calle?: string | null,
    public numero?: number | null,
    public ciudad?: string | null,
    public web?: string | null,
    public telefono?: string | null,
    public servicios?: IServicio[] | null
  ) {}
}

export function getEmpresaIdentifier(empresa: IEmpresa): number | undefined {
  return empresa.id;
}
