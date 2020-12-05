import { reduceEachTrailingCommentRange } from "typescript";
import { Ingrediente } from "./Ingrediente";
import { Harina, OtroIngrediente } from "./TipoIngrediente";
import { Receta } from "./Receta";
import { Prefermento } from "./Prefermento";
import { Decimal } from "decimal.js";

describe("Receta", () => {
  const params = { nombre: "Receta" };
  const harina000 = new Harina("Harina 000");
  const harina0000 = new Harina("Harina 0000");
  const agua = new OtroIngrediente("agua", true);
  const levadura = new OtroIngrediente("levadura", false);
  const esponja = new Prefermento({ nombre: "Esponja" });
  esponja.agregarHarina(harina000, new Decimal(100));
  esponja.agregarIngrediente(agua, new Decimal(60));
  esponja.agregarIngrediente(levadura, new Decimal(5));
  let subject: Receta;
  const initializeSubject = () => {
    subject = new Receta(params);
  };
  initializeSubject();

  it("Debe inicializrse correctamente", () => {
    expect(subject.nombre).toBe(params.nombre);
    expect(subject.ingredientes.length).toBe(0);
    expect(subject.harinas.length).toBe(0);
    expect(subject.preparaciones.length).toBe(0);
  });
  it("AgregarHarina", () => {
    subject.agregarHarina(harina000, new Decimal(100));
    subject.agregarHarina(harina000, new Decimal(20));
    expect(subject.harinas.length).toBe(2);
    expect(subject.harinas[0].proporcion).toEqual(new Decimal(100));
  });
  it("AgregarPrefermento", () => {
    subject.agregarPrefermento(esponja, new Decimal(100));
    expect(subject.preparaciones.length).toBe(1);
    expect(subject.preparaciones[0].tipo).toEqual(esponja);
  });
  it("AgregarOtroIngrediente", () => {
    subject.agregarIngrediente(agua, new Decimal(100));
    expect(subject.ingredientes.length).toBe(1);
    expect(subject.ingredientes[0].tipo).toEqual(agua);
  });

  it("porcentaje de carga de harinas", () => {
    initializeSubject();
    expect(subject.porcentajeCargaHarinas).toEqual(new Decimal(0));
    subject.agregarHarina(harina000, new Decimal(60));
    subject.agregarHarina(harina0000, new Decimal(0.5));
    expect(subject.porcentajeCargaHarinas).toEqual(new Decimal(60.5));
  });

  it("porcentaje Hidratación", () => {
    initializeSubject();
    expect(subject.porcentajeCargaHarinas).toEqual(new Decimal(0));
    subject.agregarHarina(harina000, new Decimal(100));
    subject.agregarPrefermento(esponja, new Decimal(20));
    subject.agregarIngrediente(agua, new Decimal(10));
    subject.agregarIngrediente(agua, new Decimal(50));
    expect(subject.porcentajeHidratacion).toEqual(new Decimal(72));
  });

  it("fijar cantidad total", () => {
    initializeSubject();
    expect(subject.porcentajeCargaHarinas).toEqual(new Decimal(0));
    subject.agregarHarina(harina000, new Decimal(60));
    subject.agregarHarina(harina000, new Decimal(40));

    subject.agregarPrefermento(esponja, new Decimal(20));
    subject.agregarIngrediente(agua, new Decimal(10));
    subject.agregarIngrediente(agua, new Decimal(50));
    subject.cantidadTotal = new Decimal(1800);
    subject.calcularCantidades();

    expect(subject.harinas[0].cantidad).toEqual(new Decimal(600));
  });

  it("cambiar proporción ingrediente", () => {
    initializeSubject();
    subject.agregarHarina(harina000, new Decimal(60))
    .agregarHarina(harina000, new Decimal(40))
    .agregarIngrediente(agua, new Decimal(70))
    .fijarCantidadIngrediente(subject.harinas[0],new Decimal(600))
    .calcularCantidades();
    expect(subject.ingredientes[0].cantidad).toEqual(new Decimal(700));
    subject.ingredientes[0].proporcion = new Decimal(60);
    subject.fijarCantidadIngrediente(subject.ingredientes[0],new Decimal(600));
    const a = subject.lista
    expect(subject.cantidadTotal).toEqual(new Decimal(1600));
  });

  it("fijar cantidad de un ingrediente", () => {
    initializeSubject();
    expect(subject.porcentajeCargaHarinas).toEqual(new Decimal(0));
    subject
      .agregarHarina(harina000, new Decimal(80))
      .agregarHarina(harina0000, new Decimal(20))
      .agregarPrefermento(esponja, new Decimal(20))
      .agregarIngrediente(agua, new Decimal(10))
      .agregarIngrediente(agua, new Decimal(50));

    subject.harinas[0].cantidad = new Decimal(80);
    subject.fijarCantidadIngrediente(subject.harinas[0]);
    expect(subject.harinas[0].cantidad).toEqual(new Decimal(80));
    expect(subject.cantidadTotal).toEqual(new Decimal(180));
  });

  it("porcentaje de carga de harinas", () => {
    initializeSubject();

    expect(subject.porcentajeCargaHarinas).toEqual(new Decimal(0));
    subject.agregarHarina(harina000, new Decimal(80));
    expect(subject.porcentajeCargaHarinas).toEqual(new Decimal(80));

    subject.agregarHarina(harina000, new Decimal(20));
    expect(subject.porcentajeCargaHarinas).toEqual(new Decimal(100));
  });
});
