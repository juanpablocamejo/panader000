import { reduceEachTrailingCommentRange } from "typescript";
import { Ingrediente } from "./Ingrediente";
import { Harina, OtroIngrediente } from "./TipoIngrediente";
import { Receta } from "./Receta";
import { Prefermento } from "./Prefermento";
import { Decimal } from "decimal.js";

describe("Receta", () => {
  const params = { nombre: "Receta" };
  const harina = new Harina("Harina 000");
  const agua = new OtroIngrediente("agua", true);
  const levadura = new OtroIngrediente("levadura", false);
  const esponja = new Prefermento({ nombre: "Esponja" });
  esponja.agregarHarina(harina,new Decimal(100))
  esponja.agregarIngrediente(agua,new Decimal(60))
  esponja.agregarIngrediente(levadura,new Decimal(5))
  let subject: Receta;
  const initializeSubject = () => {
    subject = new Receta(params);
  };
  initializeSubject();

  it("Debe inicializrse correctamente", () => {
    expect(subject.nombre).toBe(params.nombre);
    expect(subject.ingredientes.length).toBe(0);
    expect(subject.harinas().length).toBe(0);
    expect(subject.prefermentos.length).toBe(0);
  });
  it("AgregarHarina", () => {
    subject.agregarHarina(harina, new Decimal(100));
    expect(subject.harinas().length).toBe(1);
    expect(subject.harinas()[0].tipo).toEqual(harina);
  });
  it("AgregarPrefermento", () => {
    subject.agregarPrefermento(esponja, new Decimal(100));
    expect(subject.prefermentos().length).toBe(1);
    expect(subject.prefermentos()[0].tipo).toEqual(esponja);
  });
  it("AgregarOtroIngrediente", () => {
    subject.agregarIngrediente(agua, new Decimal(100));
    expect(subject.ingredientes().length).toBe(1);
    expect(subject.ingredientes()[0].tipo).toEqual(agua);
  });

  it("cantHarinas", () => {
    initializeSubject();
    expect(subject.porcentajeCargaHarinas()).toEqual(new Decimal(0));
    subject.agregarHarina(harina, new Decimal(60));
    subject.agregarHarina(harina, new Decimal(0.5));
    expect(
      subject.porcentajeCargaHarinas()).toEqual(new Decimal(60.5));
  });

  it("porcentaje Hidratación", () => {
    initializeSubject();
    expect(subject.porcentajeCargaHarinas()).toEqual(new Decimal(0));
    subject.agregarHarina(harina, new Decimal(100));
    subject.agregarPrefermento(esponja,new Decimal(20))
    subject.agregarIngrediente(agua, new Decimal(10));
    subject.agregarIngrediente(agua, new Decimal(50));
    expect(
      subject.porcentajeHidratacion()).toEqual(new Decimal(72));
  });

  it("fijar cantidad total", () => {
    initializeSubject();
    expect(subject.porcentajeCargaHarinas()).toEqual(new Decimal(0));
    subject.agregarHarina(harina, new Decimal(100));
    subject.agregarPrefermento(esponja,new Decimal(20))
    subject.agregarIngrediente(agua, new Decimal(10));
    subject.agregarIngrediente(agua, new Decimal(50));
    subject.cantidadTotal = new Decimal(1800);
    
    expect(subject.harinas()[0].cantidad).toEqual(new Decimal(1000));
  });

  it("fijar cantidad de un ingrediente", () => {
    initializeSubject();
    expect(subject.porcentajeCargaHarinas()).toEqual(new Decimal(0));
    subject.agregarHarina(harina, new Decimal(100));
    subject.agregarPrefermento(esponja,new Decimal(20))
    subject.agregarIngrediente(agua, new Decimal(10));
    subject.agregarIngrediente(agua, new Decimal(50));

    subject.harinas()[0].fijarCantidad(new Decimal(1000))

    expect(subject.cantidadTotal).toEqual(new Decimal(1800));
  });
});
