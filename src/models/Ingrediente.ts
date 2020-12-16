import { Decimal } from "decimal.js";
import { Receta } from "./Receta";
import type {
  Harina,
  OtroIngrediente,
  TipoIngrediente,
} from "./TipoIngrediente";

export class Ingrediente<T extends TipoIngrediente> {
  private readonly receta: Receta;
  private _proporcion: Decimal = new Decimal(0);
  private _cantidad: Decimal = new Decimal(0);
  private _tipo: T;

  public get tipo(): string {
    return this._tipo.tipo;
  }

  public get proporcion(): Decimal {
    return this._proporcion;
  }
  public get cantidad(): Decimal {
    return this._cantidad;
  }
  public set cantidad(val: Decimal) {
    this._cantidad = val;
  }

  constructor(receta: Receta, tipo: T, proporcion: Decimal) {
    this.receta = receta;
    this._tipo = tipo;
    this._proporcion = proporcion;
  }

  public get listaTotalHarinas(): Ingrediente<Harina>[] {
    return (this._tipo as any).listaTotalHarinas || [];
  }
  public get listaTotalLiquidos(): Ingrediente<OtroIngrediente>[] {
    return (this._tipo as any).listaTotalLiquidos || [];
  }

  public get nombre(): string {
    return this._tipo.nombre;
  }

  public get esLiquido(): boolean {
    return this._tipo.esLiquido;
  }

  public fijarCantidad(cantidad: Decimal) {
    this._cantidad = cantidad;
    const nuevaCantidadTotal = cantidad
      .mul(100)
      .div(this.proporcionReal)
      .toDP(2);
    this.receta.fijarCantidadTotal(nuevaCantidadTotal);
    this.actualizarCantidadesPreparación();
  }

  public fijarProporcion(proporcion: Decimal) {
    this._proporcion = proporcion;
    this.receta.calcularCantidades();
    this.actualizarCantidadesPreparación();
  }

  private actualizarCantidadesPreparación() {
    if (this._tipo instanceof Receta) {
      this._tipo.cantidadTotal = this.cantidad;
      this._tipo.calcularCantidades();
    }
  }

  public get proporcionReal(): Decimal {
    return this.proporcion.div(this.receta.sumaDeProporciones()).mul(100);
  }
}
