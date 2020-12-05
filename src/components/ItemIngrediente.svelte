<script lang="ts">
  import type { Ingrediente } from "../models/Ingrediente";
  import type { TipoIngrediente } from "../models/TipoIngrediente";
  import { createEventDispatcher } from "svelte";
  import { TextField } from "svelte-materialify";
  import { Button, Col, Row, Icon } from "svelte-materialify/src";
  import { Decimal } from "decimal.js";
  import ListaIngredientes from "./ListaIngredientes.svelte";

  export let tipos: TipoIngrediente[] = [];
  export let valor: Ingrediente<TipoIngrediente>;
  $: proporcion = valor.proporcion.toFixed(2);
  $: cantidad = valor.cantidad.toFixed(2);
  $: items = [...tipos.map((t) => ({ value: t, text: t.nombre }))];
  const dispatch = createEventDispatcher();

  function handleRemove() {
    console.log("remove:", valor);
    dispatch("remove", valor);
  }
  let editandoProporcion = false;
  let editandoCantidad = false;

  const editarProporcion = (val) => () => {
    editandoProporcion = val;
    console.log(val);
  };
  const editarCantidad = (val) => () => {
    editandoCantidad = val;
  };

  const defaultProps = { rules: [], validateOnBlur: null, error: null };
  function cambiarCantidad(e) {
    valor.fijarCantidad(new Decimal(e.target.value))
    dispatch("change");
  }
  function cambiarProporcion(e) {
    valor.fijarProporcion( new Decimal(e.target.value));
    dispatch("change");
  }
</script>

<Row>
  <Col>{valor.tipo.nombre}</Col>
  <Col>    <TextField type="number"
    {...defaultProps}
    class="inactive"
    value={proporcion}
    on:change={cambiarProporcion} /></Col>
  <Col>
    <TextField  type="number"
      {...defaultProps}
      class="inactive"
      value={cantidad}
      on:change={cambiarCantidad} />
  </Col>
</Row>
