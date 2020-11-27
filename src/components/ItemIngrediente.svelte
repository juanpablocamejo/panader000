<script lang="ts">
  import type { Ingrediente } from "../models/Ingrediente";
  import type { TipoIngrediente } from "../models/TipoIngrediente";
  import { createEventDispatcher } from "svelte";
  import Select from "./Select.svelte";
  import TextField from "./TextField.svelte";
  import { Button, Col, FormGroup, Row } from "sveltestrap";
  import {Decimal} from 'decimal.js'

  export let tipos: TipoIngrediente[] = [];
  export let valor: Ingrediente<TipoIngrediente>;
  $: proporcion = valor.proporcion.toString();
  let nuevo = { text: "Nuevo tipo...", value: null as any };
  nuevo.value = nuevo;
  $: items = [...tipos.map((t) => ({ value: t, text: t.nombre })), nuevo];
  const dispatch = createEventDispatcher();
  let addMode = false;
  let nuevoTipo: TipoIngrediente = {
    nombre: "",
    esLiquido: false,
    proporcionDefault: new Decimal(0),
  };

  function handleSave() {
    dispatch("save", nuevoTipo);
    valor.tipo = nuevoTipo;
    nuevoTipo = { nombre: "", esLiquido: false, proporcionDefault: new Decimal(0) };
    toggleAddMode();
    dispatch("change");
  }
  function toggleAddMode() {
    addMode = !addMode;
  }

  function handleChange(event: any) {
    if (event.detail === nuevo) {
      addMode = true;
    } else {
      dispatch("change");
    }
  }

  function handleRemove() {
    console.log("remove:", valor);
    dispatch("remove", valor);
  }
  let inputPropsTipo = {
    placeholder: "Nombre del tipo de ingrediente",
  };
</script>
<Row>
<div class="form-row">
  
  
<Col>
  <FormGroup>
    {#if !addMode}
    <Select
    label="Ingrediente"
    {items}
    bind:value={valor.tipo}
    on:change={handleChange} />
    {:else}
    <TextField bind:value={nuevoTipo.nombre} inputProps={inputPropsTipo} />
    {/if}
  </FormGroup>
</Col>
{#if !addMode}
  <Col>
    <FormGroup>
      <TextField
        label="Cantidad (%)"
        bind:value={proporcion}
        on:input={() => dispatch('change')} />
    </FormGroup>
  </Col>
{/if}
{#if addMode}
  <Col>
    <Button  class="mb-2" 
      color="success"
      outline
      disabled={!nuevoTipo.nombre.length}
      on:click={handleSave}>Guardar</Button>
  </Col>
{/if}
<Col>
  <Button class="mb-2" color="danger" outline on:click={handleRemove} >Eliminar</Button>
</Col>

</div>
</Row>
