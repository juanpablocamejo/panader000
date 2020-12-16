import { Harina, OtroIngrediente } from "./TipoIngrediente";
import { Receta } from "./Receta";
import { Decimal } from "decimal.js";

describe("Receta", () => {
  const params = { nombre: "Receta" };
  let subject: Receta;
  const initializeSubject = () => {
    subject = new Receta(params);
  };
  const harina000 = new Harina({ nombre: "Harina 000" });
  const harina0000 = new Harina({ nombre: "Harina 0000" });
  const agua = new OtroIngrediente({ nombre: "agua", esLiquido: true });
  const levadura = new OtroIngrediente({
    nombre: "levadura",
    esLiquido: false,
  });
  const esponja = new Receta({ nombre: "Esponja" });
  esponja.agregar(harina000, new Decimal(100));
  esponja.agregar(agua, new Decimal(60));
  esponja.agregar(levadura, new Decimal(5));

  beforeEach(() => initializeSubject());
  it("Debe inicializarse correctamente", () => {
    expect(subject.nombre).toBe(params.nombre);
    expect(subject.otrosIngredientes.length).toBe(0);
    expect(subject.harinas.length).toBe(0);
    expect(subject.preparaciones.length).toBe(0);
  });
  it("agregar", () => {
    subject.agregar(harina000, new Decimal(100));
    subject.agregar(harina000, new Decimal(20));
    expect(subject.harinas.length).toBe(2);
    expect(subject.harinas[0].proporcion).toEqual(new Decimal(100));
  });
  it("eliminar harina", () => {
    subject.agregar(harina000, new Decimal(100));
    subject.agregar(harina000, new Decimal(20));
    expect(subject.harinas.length).toBe(2);
    subject.eliminar(subject.harinas[0]);
    expect(subject.harinas.length).toBe(1);
    subject.eliminar(subject.harinas[0]);
    expect(subject.harinas.length).toBe(0);
  });

  it("Agregar Prefermento", () => {
    subject.agregar(esponja, new Decimal(100));
    expect(subject.preparaciones.length).toBe(1);
    expect(subject.preparaciones[0].nombre).toEqual(esponja.nombre);
  });
  it("Agregar OtroIngrediente", () => {
    subject.agregar(agua, new Decimal(100));
    expect(subject.otrosIngredientes.length).toBe(1);
    expect(subject.otrosIngredientes[0].nombre).toEqual(agua.nombre);
  });

  it("porcentaje de hidratación sin prefermento", () => {
    initializeSubject();
    subject.agregar(harina000, new Decimal(100));
    subject.agregar(agua, new Decimal(10));
    subject.agregar(agua, new Decimal(50));
    expect(subject.porcentajeHidratacion).toEqual(new Decimal(60));
  });

  it("porcentaje de hidratación con prefermento", () => {
    initializeSubject();
    subject.agregar(harina000, new Decimal(100));
    subject.agregar(esponja, new Decimal(20));
    subject.agregar(agua, new Decimal(10));
    subject.agregar(agua, new Decimal(50));
    expect(subject.porcentajeHidratacion).toEqual(new Decimal(60));
  });

  it("fijar cantidad total", () => {
    initializeSubject();
    expect(subject.porcentajeCargaHarinas).toEqual(new Decimal(0));
    subject.agregar(harina000, new Decimal(60));
    subject.agregar(harina000, new Decimal(40));

    subject.agregar(esponja, new Decimal(20));
    subject.agregar(agua, new Decimal(10));
    subject.agregar(agua, new Decimal(50));
    subject.cantidadTotal = new Decimal(1800);
    subject.calcularCantidades();

    expect(subject.harinas[0].cantidad).toEqual(new Decimal(600));
  });

  it("cambiar proporción ingrediente", () => {
    initializeSubject();
    subject
      .agregar(harina000, new Decimal(60))
      .agregar(harina0000, new Decimal(40))
      .agregar(agua, new Decimal(70))
      .harinas[0].fijarCantidad(new Decimal(600));

    expect(subject.otrosIngredientes[0].cantidad).toEqual(new Decimal(700));
    subject.otrosIngredientes[0].fijarProporcion(new Decimal(60));
    subject.harinas[0].fijarCantidad(new Decimal(600));
    expect(subject.cantidadTotal).toEqual(new Decimal(1600));
    expect(subject.otrosIngredientes[0].cantidad).toEqual(new Decimal(600));
  });

  it("fijar cantidad de un ingrediente", () => {
    initializeSubject();
    expect(subject.porcentajeCargaHarinas).toEqual(new Decimal(0));
    subject
      .agregar(harina000, new Decimal(80))
      .agregar(harina0000, new Decimal(20))
      .agregar(esponja, new Decimal(20))
      .agregar(agua, new Decimal(10))
      .agregar(agua, new Decimal(50));

    subject.harinas[0].fijarCantidad(new Decimal(80));
    expect(subject.harinas[0].cantidad).toEqual(new Decimal(80));
    expect(subject.cantidadTotal).toEqual(new Decimal(180));
  });

  it("porcentaje de carga de harinas incompleto", () => {
    initializeSubject();
    expect(subject.porcentajeCargaHarinas).toEqual(new Decimal(0));
    subject.agregar(harina000, new Decimal(60));
    subject.agregar(harina0000, new Decimal(0.5));
    expect(subject.porcentajeCargaHarinas).toEqual(new Decimal(60.5));
  });

  it("porcentaje de carga de harinas completo", () => {
    initializeSubject();

    expect(subject.porcentajeCargaHarinas).toEqual(new Decimal(0));
    subject.agregar(harina000, new Decimal(80));
    expect(subject.porcentajeCargaHarinas).toEqual(new Decimal(80));

    subject.agregar(harina000, new Decimal(20));
    expect(subject.porcentajeCargaHarinas).toEqual(new Decimal(100));
  });
});
