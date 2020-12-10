import { writable, derived, Writable, Readable } from "svelte/store";
import { Prefermento } from "./Prefermento";
import type { Receta } from "./Receta";
import { Harina, OtroIngrediente, TipoIngrediente } from "./TipoIngrediente";
import { collectionStore } from "sveltefire";
import type firebase from "firebase/app";

export const tiposRecetas = writable<Receta[]>([]);
export const tiposPrefermentos = writable<Prefermento[]>([
  new Prefermento({ nombre: "Poolish" }),
]);
export const tiposHarinas = writable<Harina[]>(
  [
    "Harina de trigo (000)",
    "Harina de trigo (0000)",
    "Harina de trigo (Integral)",
  ].map((nombre) => new Harina(nombre))
);
export const tiposIngredientes = writable<OtroIngrediente[]>(
  [
    { nombre: "Agua", esLiquido: true },
    { nombre: "Leche", esLiquido: true },
    { nombre: "Manteca", esLiquido: false },
    { nombre: "Sal", esLiquido: false },
    { nombre: "Azucar", esLiquido: false },
  ].map((obj) => new OtroIngrediente(obj.nombre, obj.esLiquido))
);

export class FirebaseStore<T> implements Readable<T[]> {
  private store: Readable<T[]>;

  constructor(private tipo:{new(args:Partial<T>):T;},
    path: string,
    query?: (
      ref: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
    ) => any
  ) {
    this.initialize(path,query);
  }

  subscribe(
    run: (value: T[]) => void,
    invalidate?: (value?: T[]) => void
  ): () => void {
    return this.store.subscribe(run, invalidate);
  }

  private initialize(path, query) {
    this.store = derived(collectionStore(path,query) as Readable<T[]>, (data) =>
      data?.map((i) => new this.tipo(i)) ?? []
    );
  }
}
