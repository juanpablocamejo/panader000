<script lang="ts">
  import type { Ingrediente } from "../models/Ingrediente";
  import type { TipoIngrediente } from "../models/TipoIngrediente";
  import ItemIngrediente from "./ItemIngrediente.svelte";
  import { createEventDispatcher } from "svelte";

  export let titulo: string = "";
  export let tipos: TipoIngrediente[] = [];
  export let valor: Ingrediente<TipoIngrediente>[] = [];
  export let deshabilitarCarga: boolean;
  const dispatch = createEventDispatcher();

</script>

{#each valor as ingrediente}
  <ItemIngrediente {tipos} valor={ingrediente} on:save on:change on:remove on:fijarCantidad />
{/each}
