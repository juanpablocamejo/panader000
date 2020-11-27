import { Decimal } from "decimal.js";

export abstract class TipoIngrediente {
  public readonly nombre: string;
  public readonly esLiquido: boolean = false;
  public proporcionDefault: Decimal = new Decimal(0);

  constructor(params?: Partial<TipoIngrediente>) {
    this.nombre = params?.nombre;
    this.esLiquido = params?.esLiquido;
    this.proporcionDefault = params?.proporcionDefault;
  }
}

export class Harina extends TipoIngrediente {
  constructor(nombre: string) {
    super({ nombre, esLiquido: false, proporcionDefault: new Decimal(100) });
  }
}

export class OtroIngrediente extends TipoIngrediente {
  constructor(nombre: string, esLiquido: boolean) {
    super({ nombre, esLiquido });
  }
}
