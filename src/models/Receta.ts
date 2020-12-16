import { Decimal } from "decimal.js";
import { Ingrediente } from "./Ingrediente";
import { Harina, OtroIngrediente, TipoIngrediente } from "./TipoIngrediente";
const cero = new Decimal(0);

export class Receta extends TipoIngrediente {
  public cantidadTotal: Decimal = new Decimal(1000);
  private _harinas: Ingrediente<Harina>[];
  private _preparaciones: Ingrediente<Receta>[];
  private _otrosIngredientes: Ingrediente<OtroIngrediente>[];
  private _listas: Map<string, any[]>;

  protected inicializar(params?:Partial<TipoIngrediente>) {
    super.inicializar(params);
    this._harinas = [];
    this._preparaciones = [];
    this._otrosIngredientes = [];
    this._listas = new Map<string,Ingrediente<TipoIngrediente>[]>();
    this._listas.set(Harina.name, this._harinas);
    this._listas.set(OtroIngrediente.name, this._otrosIngredientes);
    this._listas.set(Receta.name, this._preparaciones);
  }


  public get harinas(): Ingrediente<Harina>[] {
    return this._harinas;
  }
  public get preparaciones(): Ingrediente<Receta>[] {
    return this._preparaciones;
  }
  public get otrosIngredientes(): Ingrediente<OtroIngrediente>[] {
    return this._otrosIngredientes;
  }

  public get porcentajeCargaHarinas(): Decimal {
    return this._harinas.reduce(
      (sum, x) => sum.plus(x.proporcion || cero),
      cero
    );
  }

  public get listaIngredientes(): Ingrediente<TipoIngrediente>[] {
    return [...this.harinas, ...this.otrosIngredientes, ...this.preparaciones];
  }

  public get listaTotalHarinas(): Ingrediente<Harina>[] {
    return this.harinas.concat(
      ...this.preparaciones.map((p) => p.listaTotalHarinas)
    );
  }
  
  public get listaTotalLiquidos(): Ingrediente<OtroIngrediente>[] {
    return this.otrosIngredientes
      .filter((i) => i.esLiquido)
      .concat(...this.preparaciones.map((p) => p.listaTotalLiquidos));
  }

  private get cantidadTotalHarina(): Decimal {
    return this.listaTotalHarinas.reduce(
      (sum, h) => sum.plus(h.cantidad),
      cero
    );
  }
  private get cantidadTotalLiquido(): Decimal {
    return this.listaTotalLiquidos.reduce(
      (sum, h) => sum.plus(h.cantidad),
      cero
      );
    }
    public get porcentajeHidratacion(): Decimal {
      return this.cantidadTotalLiquido.div(this.cantidadTotalHarina).mul(100).toDP(2);
    }

  public agregar<T extends TipoIngrediente>(
    tipoIngrediente: T,
    proporcion: Decimal
  ): Receta {
    const lista = this._listas.get(tipoIngrediente.tipo);
    lista.push(new Ingrediente<T>(this, tipoIngrediente, proporcion));
    this.calcularCantidades();
    return this;
  }

  public eliminar<T extends TipoIngrediente>(
    ingrediente: Ingrediente<T>
  ): Receta {
    const lista = this._listas.get(ingrediente.tipo);
    lista.splice(lista.indexOf(ingrediente),1)
    return this;
  }

  public calcularCantidadIngrediente(
    ingrediente: Ingrediente<TipoIngrediente>
  ) {
    return this.cantidadHarina.mul(ingrediente.proporcion.div(100));
  }

  public fijarCantidadTotal(cant: Decimal) {
    this.cantidadTotal = cant;
    this.calcularCantidades();
    return this;
  }

  public calcularCantidades() {
    const cantidadHarina = this.cantidadHarina;
    this.calcularCantidadesLista(cantidadHarina, this.harinas);
    this.calcularCantidadesLista(cantidadHarina, this.preparaciones);
    this.calcularCantidadesLista(cantidadHarina, this.otrosIngredientes);
    return this;
  }


  public sumaDeProporciones() {
    return this.listaIngredientes
      .map((i) => i.proporcion)
      .reduce((sum, i) => sum.plus(i), new Decimal(0));
  }

  public get cantidadHarina(): Decimal {
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

  public get lista(): string[] {
    const ing = this.listaIngredientes.map((i) =>
      [i.nombre, i.proporcion.toFixed(2), i.cantidad.toFixed(2)].join(" ")
    );
    return [
      `Peso Total: ${this.cantidadTotal}`,
      `Hidratación: ${this.porcentajeHidratacion}`,
      ...ing,
    ];
  }
}
