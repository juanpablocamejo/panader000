import { Decimal } from "decimal.js";
import { Ingrediente } from "./Ingrediente";
import { Harina } from "./TipoIngrediente";

describe("Ingrediente", () => {
  it("debe tomar la proporcion por defecto del tipo de ingrediente", () => {
    const type = new Harina({nombre:"Harina 000"});
    const obj = new Ingrediente(null,type, new Decimal(100));
    expect(obj.proporcion.equals(new Decimal(100))).toBeTruthy();
  });
});
