
import { writable } from 'svelte/store';
import { Prefermento } from "./Prefermento";
import type { Receta } from "./Receta";
import { Harina, OtroIngrediente, TipoIngrediente } from "./TipoIngrediente";

export const tiposRecetas = writable<Receta[]>([]);
export const tiposPrefermentos = writable<Prefermento[]>([new Prefermento({ nombre: "Poolish" })]);
export const tiposHarinas = writable<Harina[]>(
    ["Harina de trigo (000)", 'Harina de trigo (0000)', 'Harina de trigo (Integral)']
        .map(nombre => new Harina(nombre))
);
export const tiposIngredientes = writable<OtroIngrediente[]>(
    [
        { nombre: "Agua", esLiquido: true },
        { nombre: "Leche", esLiquido: true },
        { nombre: "Manteca", esLiquido: false },
        { nombre: "Sal", esLiquido: false },
        { nombre: "Azucar", esLiquido: false }
    ]
    .map(obj => new OtroIngrediente(obj.nombre, obj.esLiquido))
);