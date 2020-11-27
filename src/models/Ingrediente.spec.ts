import { Decimal } from "decimal.js";
import { Ingrediente } from "./Ingrediente";
import { Harina } from "./TipoIngrediente";

describe("Ingrediente", () => {
  it("should take default proportion from IngredientType", () => {
    const type = new Harina("Harina 000");
    const obj = new Ingrediente(null,type, new Decimal(100));
    expect(obj.proporcion.equals(new Decimal(100))).toBeTruthy();
  });
});
