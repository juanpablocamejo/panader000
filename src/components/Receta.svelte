<script lang="ts">
  import { Receta } from "../models/Receta";
  import ListaIngredientes from "./ListaIngredientes.svelte";
  import type { Ingrediente } from "../models/Ingrediente";
  import {
    Harina,
    OtroIngrediente,
    TipoIngrediente,
  } from "../models/TipoIngrediente";
  import {
    tiposHarinas,
    tiposIngredientes,
    tiposPrefermentos,
  } from "../models/Store";
  import { Prefermento } from "../models/Prefermento";
  import { Row, Col, Container, Select, Footer } from "svelte-materialify/src";
  import { Decimal } from "decimal.js";
  import { Button } from "svelte-materialify";

  let receta = new Receta();
  let harinas: Ingrediente<Harina>[] = [];
  let ingredientes: Ingrediente<OtroIngrediente>[] = [];
  let prefermentos: Ingrediente<TipoIngrediente>[] = [];
  let harinasCompleto = false;
  $: harinas = receta.harinas;
  $: ingredientes = receta.ingredientes;
  $: prefermentos = receta.preparaciones;
  $: cantHarinas = harinas.reduce((sum, x) => +sum + +x.proporcion, 0);
  $: harinasCompleto = receta.porcentajeCargaHarinas.equals(100);
  $: cantidadTotal = receta.cantidadTotal;
  $: receta = receta;
  const harina000 = new Harina("Harina 000");
  const harina0000 = new Harina("Harina 0000");
  const agua = new OtroIngrediente("agua", true);
  const levadura = new OtroIngrediente("levadura", false);
  const esponja = new Prefermento({ nombre: "Esponja" });
  esponja.agregarHarina(harina000, new Decimal(80));
  esponja.agregarIngrediente(agua, new Decimal(60));
  esponja.agregarIngrediente(levadura, new Decimal(5));
  receta.agregarHarina(harina000, new Decimal(80));
  receta.agregarHarina(harina0000, new Decimal(20));
  function agregarTipoHarina(evt: CustomEvent) {
    console.log("agregar tipo de harina", evt);
    // app.AgregarTipo(StoreTypes.TipoHarina,evt.detail);
  }
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };
  let selected;
  let items = [];

  tiposIngredientes.subscribe((val) => {
    items = val.map((ti, idx) => ({ name: ti.nombre, value: ti }));
  });

  const getTipo = (nombre) => items.find((i) => i.nombre == nombre);

  receta = receta.calcularCantidades();
</script>

<Container>
  <Row>
    <Col>
      <label>
        Cantidad Total:
        <input
          type="number"
          value={cantidadTotal.toFixed(2)}
          on:change={(e) => {
            receta = receta.fijarCantidadTotal(new Decimal(e.target.value));
          }} />
      </label>
    </Col>
  <Col>% Hidratación: {receta.porcentajeHidratacion}%</Col>
  <Col>% Harinas: {receta.porcentajeCargaHarinas}%</Col>
  </Row>
  <Row>
    <Col>Ingrediente</Col>
    <Col>Proporción</Col>
    <Col>Peso (gr)</Col>
  </Row>
  <ListaIngredientes
    on:change={() => {
      receta = receta;
    }}
    titulo="Harina/s"
    deshabilitarCarga={harinasCompleto}
    valor={harinas}
    tipos={$tiposHarinas} />
  <ListaIngredientes
    on:change={() => {
      receta = receta;
    }}
    titulo="Prefermento/s"
    valor={prefermentos}
    tipos={$tiposPrefermentos}
    deshabilitarCarga={false} />
  {#if ingredientes.length}
    <ListaIngredientes
      on:change={() => {
        receta = receta;
      }}
      titulo="Otros Ingredientes"
      valor={ingredientes}
      deshabilitarCarga={false} />
  {/if}

</Container>
<div style="height: 200px;position:relative;">
  <Footer class="justify-center pa-2" absolute>
    <Row>
      <Col>
        <Select value={selected} {items} format={(i)=>i.nombre}>
  
        </Select>
      </Col>
  
      <Col>
        <Button
          on:click={() => {
            console.log(selected)
            receta = receta.agregarIngrediente(selected, new Decimal(0));
          }}>
          Agregar
        </Button>
      </Col>
    </Row>
  </Footer>
</div>