import { Decimal } from "decimal.js";
import { Ingrediente } from "./Ingrediente";
import type { Prefermento } from "./Prefermento";
import { Harina, OtroIngrediente, TipoIngrediente } from "./TipoIngrediente";
const cero = new Decimal(0);

export class Receta extends TipoIngrediente {
  public cantidadTotal: Decimal = new Decimal(1000);
  private _harinas: Ingrediente<Harina>[] = [];
  private _preparaciones: Ingrediente<Receta>[] = [];
  private _ingredientes: Ingrediente<OtroIngrediente>[] = [];

  constructor(params?: Partial<Receta>) {
    super(params && (params as Partial<TipoIngrediente>));
  }

  public get harinas() {
    return this._harinas;
  }
  public get preparaciones() {
    return this._preparaciones;
  }
  public get ingredientes() {
    return this._ingredientes;
  }

  public get porcentajeCargaHarinas(): Decimal {
    return this._harinas.reduce(
      (sum, x) => sum.plus(x.proporcion || cero),
      cero
    );
  }
  public get porcentajeHidratacion(): Decimal {
    return this._preparaciones
      .reduce(
        (sum, p) => p.tipo.porcentajeHidratacion.mul(p.proporcion.div(100)),
        cero
      )
      .plus(
        this._ingredientes.reduce(
          (sum, i) => sum.plus(i.tipo.esLiquido ? i.proporcion : cero),
          cero
        )
      );
  }

  public agregarHarina(harina: Harina, proporcion: Decimal): Receta {
    this._harinas = this.agregar(this._harinas, harina, proporcion);
    return this;
  }

  public agregarIngrediente(
    ingrediente: OtroIngrediente,
    proporcion: Decimal
  ): Receta {
    this._ingredientes = this.agregar(
      this._ingredientes,
      ingrediente,
      proporcion
    );
    return this;
  }

  public agregarPrefermento(
    prefermento: Prefermento,
    proporcion: Decimal
  ): Receta {
    this._preparaciones = this.agregar(
      this._preparaciones,
      prefermento,
      proporcion
    );
    return this;
  }

  public eliminarHarina(item: Ingrediente<Harina>): Receta {
    this._harinas = this.eliminar(item, this._harinas);
    return this;
  }

  public eliminarIngrediente(item: Ingrediente<OtroIngrediente>): Receta {
    this._ingredientes = this.eliminar(item, this._ingredientes);
    return this;
  }

  public eliminarPrefermento(item: Ingrediente<Prefermento>): Receta {
    this._preparaciones = this.eliminar(item, this._preparaciones);
    return this;
  }

  private agregar<T extends TipoIngrediente>(
    lista: Ingrediente<T>[],
    TipoIngrediente: T,
    proporcion: Decimal
  ): Ingrediente<T>[] {
    return [...lista, new Ingrediente<T>(this, TipoIngrediente, proporcion)];
  }

  public eliminar<T extends TipoIngrediente>(
    ingrediente: Ingrediente<T>,
    lista: Ingrediente<T>[]
  ): Ingrediente<T>[] {
    return lista.filter((i) => i === ingrediente);
  }

  public calcularCantidadIngrediente(
    ingrediente: Ingrediente<TipoIngrediente>
  ) {
    return this.calcularCantidadHarina().mul(ingrediente.proporcion.div(100));
  }

  public fijarCantidadTotal(cant:Decimal){
    this.cantidadTotal = cant;
    this.calcularCantidades();
    return this;
  }
  public fijarCantidadIngrediente(ingrediente: Ingrediente<TipoIngrediente>, cantidad?:Decimal) {
    if (cantidad) ingrediente.cantidad = cantidad;
    this.cantidadTotal = ingrediente.cantidad
      .mul(100)
      .div(ingrediente.proporcionReal)
      .toDP(2);

    this.calcularCantidades();
    return this;
  }

  public calcularCantidades() {
    const cantidadHarina = this.calcularCantidadHarina();
    this.calcularCantidadesLista(cantidadHarina, this.harinas);
    this.calcularCantidadesLista(cantidadHarina, this.preparaciones);
    this.calcularCantidadesLista(cantidadHarina, this.ingredientes);
    return this;
  }

  public get listaIngredientes(): Ingrediente<TipoIngrediente>[] {
    return [...this.harinas, ...this.preparaciones, ...this.ingredientes];
  }

  public sumaDeProporciones() {
    return this.listaIngredientes
      .map((i) => i.proporcion)
      .reduce((sum, i) => sum.plus(i), new Decimal(0));
  }

  private calcularCantidadHarina() {
    return this.cantidadTotal.div(this.sumaDeProporciones().div(100));
  }

  private calcularCantidadesLista(
    cantidadHarina: Decimal,
    coleccion: Ingrediente<TipoIngrediente>[]
  ) {
    coleccion.forEach((i) => {
      const newVal = cantidadHarina
        .mul(i.proporcion.div(new Decimal(100)))
        .toDP(2);
      if (!i.cantidad.toDP(2).equals(newVal)) i.cantidad = newVal;
    });
  }
  public get lista():string[]{
    const ing = this.listaIngredientes.map(i=>[i.tipo.nombre,i.proporcion.toFixed(2), i.cantidad.toFixed(2)].join(' '));
    return [`Peso Total: ${this.cantidadTotal}`,`Hidratación: ${this.porcentajeHidratacion}`,...ing]
  }
}
