import { Decimal } from "decimal.js";
import type { Ingrediente } from "./Ingrediente";

export interface ITipoIngrediente {
  readonly nombre: string;
  readonly esLiquido: boolean;
  readonly proporcionDefault: Decimal;
  readonly listaTotalHarinas: Ingrediente<Harina>[];  
  readonly listaTotalLiquidos: Ingrediente<OtroIngrediente>[];  
}

export class TipoIngrediente implements ITipoIngrediente {
  public tipo:string;
  protected _nombre: string;
  protected _esLiquido: boolean = false;
  protected _proporcionDefault: Decimal = new Decimal(0);

  public get nombre(){
    return this._nombre;
  }
  public get esLiquido(){
    return this._esLiquido;
  }
  public get proporcionDefault(){
    return this._proporcionDefault;
  }

  constructor(params?: Partial<TipoIngrediente>) {
    this.tipo = this.constructor.name;
    this.inicializar(params)
  }
  public get listaTotalHarinas(): Ingrediente<Harina>[]{return []}
  public get listaTotalLiquidos(): Ingrediente<OtroIngrediente>[]{return []}

  protected inicializar(params?: Partial<TipoIngrediente>){
    
    this._nombre = params?.nombre;
    this._esLiquido = params?.esLiquido;
    this._proporcionDefault = params?.proporcionDefault || new Decimal(0)
  }
}

export class Harina extends TipoIngrediente {
  protected incializar({nombre}) {
    this._nombre = nombre
  }
}

export class OtroIngrediente extends TipoIngrediente {
  protected incializar({nombre,esLiquido}) {
    this._nombre = nombre
    this._esLiquido = esLiquido
  }
}
