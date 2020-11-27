import { Decimal } from "decimal.js";
import { Ingrediente } from "./Ingrediente";
import type { Prefermento } from "./Prefermento";
import { Harina, OtroIngrediente, TipoIngrediente } from "./TipoIngrediente";
const cero = new Decimal(0);

export class Receta extends TipoIngrediente {
  public _cantidadTotal: Decimal = new Decimal(1000);
  private _harinas: Ingrediente<Harina>[] = [];
  private _prefermentos: Ingrediente<Receta>[] = [];
  private _ingredientes: Ingrediente<OtroIngrediente>[] = [];

  constructor(params?: Partial<Receta>) {
    super(params && (params as Partial<TipoIngrediente>));
  }
  get cantidadTotal(): Decimal {
    return this._cantidadTotal;
  }

  set cantidadTotal(valor: Decimal) {
    this._cantidadTotal = valor;
    this.calcularCantidades();
  }

  public readonly harinas = () => this._harinas;
  public readonly prefermentos = () => this._prefermentos;
  public readonly ingredientes = () => this._ingredientes;

  public porcentajeCargaHarinas(): Decimal {
    return this._harinas.reduce(
      (sum, x) => sum.plus(x.proporcion || cero),
      cero
    );
  }
  public porcentajeHidratacion(): Decimal {
    return this._prefermentos
      .reduce(
        (sum, p) => p.tipo.porcentajeHidratacion().mul(p.proporcion.div(100)),
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
    this.calcularCantidades();
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
    this.calcularCantidades();
    return this;
  }

  public agregarPrefermento(
    prefermento: Prefermento,
    proporcion: Decimal
  ): Receta {
    this._prefermentos = this.agregar(
      this._prefermentos,
      prefermento,
      proporcion
    );
    this.calcularCantidades();
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
    this._prefermentos = this.eliminar(item, this._prefermentos);
    return this;
  }

  private agregar<T extends TipoIngrediente>(
    lista: Ingrediente<T>[],
    TipoIngrediente: T,
    proporcion: Decimal
  ): Ingrediente<T>[] {
    return [new Ingrediente<T>(this, TipoIngrediente, proporcion), ...lista];
  }

  public eliminar<T extends TipoIngrediente>(
    ingrediente: Ingrediente<T>,
    lista: Ingrediente<T>[]
  ): Ingrediente<T>[] {
    return lista.filter((i) => i === ingrediente);
  }

  public calcularCantidades() {
    const cantidadHarina = this.calcularCantidadHarina();
    this.calcularCantidadesLista(cantidadHarina, this.harinas());
    this.calcularCantidadesLista(cantidadHarina, this.prefermentos());
    this.calcularCantidadesLista(cantidadHarina, this.ingredientes());
  }

  private listaIngredientes() {
    return [...this.harinas(), ...this.prefermentos(), ...this.ingredientes()];
  }

  public sumaDeProporciones(){
     return this.listaIngredientes()
        .map((i) => i.proporcion)
        .reduce((sum,i)=>sum.plus(i), new Decimal(0))
  }

  private calcularCantidadHarina() {
    return this._cantidadTotal.div(
      this.sumaDeProporciones().div(100)
    );
  }

  private calcularCantidadesLista(
    cantidadHarina: Decimal,
    coleccion: Ingrediente<TipoIngrediente>[]
  ) {
    coleccion.forEach((i) => {
      i.cantidad = cantidadHarina.mul(i.proporcion.div(new Decimal(100)));
    });
  }
}
