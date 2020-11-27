import { Decimal } from "decimal.js";
import type { Receta } from "./Receta";
import type { TipoIngrediente } from "./TipoIngrediente";

export class Ingrediente<T extends TipoIngrediente> {
  private readonly receta: Receta;
  public proporcion: Decimal = new Decimal(0);
  public tipo: T;
  public cantidad: Decimal;

  constructor(receta: Receta, tipo: T, proporcion: Decimal) {
    this.receta = receta;
    this.tipo = tipo;
    this.proporcion = proporcion;
  }

  public proporcionReal() {
    return this.proporcion.div(this.receta.sumaDeProporciones()).mul(100);
  }

  public fijarCantidad(cantidad: Decimal) {
    this.receta.cantidadTotal = cantidad.mul(100).div(this.proporcionReal());
  }
}
