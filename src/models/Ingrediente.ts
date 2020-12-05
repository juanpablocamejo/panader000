import { Decimal } from "decimal.js";
import type { Receta } from "./Receta";
import type { TipoIngrediente } from "./TipoIngrediente";

export class Ingrediente<T extends TipoIngrediente> {
  private readonly receta: Receta;
  public proporcion: Decimal = new Decimal(0);
  public tipo: T;
  public cantidad: Decimal = new Decimal(0);

  constructor(receta: Receta, tipo: T, proporcion: Decimal) {
    this.receta = receta;
    this.tipo = tipo;
    this.proporcion = proporcion;
  }

  public fijarCantidad(cantidad:Decimal) {
    this.receta.fijarCantidadIngrediente(this,cantidad);
  }

  public fijarProporcion(proporcion:Decimal){
    this.proporcion = proporcion;
    this.receta.calcularCantidades();
  }

  public get proporcionReal(): Decimal {
    return this.proporcion.div(this.receta.sumaDeProporciones()).mul(100);
  }
}
