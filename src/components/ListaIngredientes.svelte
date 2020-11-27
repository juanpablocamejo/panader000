<script lang="ts">
  import type { Ingrediente } from "../models/Ingrediente";
  import type { TipoIngrediente } from "../models/TipoIngrediente";
  import ItemIngrediente from "./ItemIngrediente.svelte";
  import { createEventDispatcher } from "svelte";
  import { Button } from "sveltestrap";

  export let titulo: string = "";
  export let tipos: TipoIngrediente[] = [];
  export let valor: Ingrediente<TipoIngrediente>[] = [];
  export let deshabilitarCarga: boolean;
  const dispatch = createEventDispatcher();
  const handleAdd = () => {
    console.log("add");
    dispatch("add", {});
  };
</script>

<div>
  <fieldset>
    <legend>{titulo}</legend>
    <ul>
      {#each valor as ingrediente}
        <ItemIngrediente
          {tipos}
          valor={ingrediente}
          on:save
          on:change
          on:remove />
      {/each}
      {#if !deshabilitarCarga}
        <li>
          <Button on:click={handleAdd}>agregar</Button>
        </li>
      {/if}
    </ul>
  </fieldset>
</div>
