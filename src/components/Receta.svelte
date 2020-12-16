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
    FirebaseStore,
    tiposHarinas,
    tiposIngredientes,
    tiposPrefermentos,
  } from "../models/Store";
  import { Row, Col, Container, Select, Footer, ProgressLinear } from "svelte-materialify/src";
  import { Decimal } from "decimal.js";
  import { Button } from "svelte-materialify";
  import { selectStore } from "../utils";
  
  const tipos = selectStore(
    new FirebaseStore(TipoIngrediente, "tiposIngredientes"),
    "nombre"
  );
  let receta = new Receta();
  let harinas: Ingrediente<Harina>[] = [];
  let ingredientes: Ingrediente<OtroIngrediente>[] = [];
  let prefermentos: Ingrediente<TipoIngrediente>[] = [];
  let harinasCompleto = false;
  $: harinas = receta.harinas;
  $: ingredientes = receta.otrosIngredientes;
  $: prefermentos = receta.preparaciones;
  $: harinasCompleto = receta.porcentajeCargaHarinas.equals(100);
  $: cantidadTotal = receta.cantidadTotal;
  $: receta = receta;
  $: porcentajeHarinas = receta.porcentajeCargaHarinas;
  const harina000 = new Harina({nombre:"Harina 000"});
  const harina0000 = new Harina({nombre:"Harina 0000"});
  const agua = new OtroIngrediente({nombre:"agua", esLiquido:true});
  const levadura = new OtroIngrediente({nombre:"levadura", esLiquido:false});
  const esponja = new Receta({ nombre: "Esponja" });
  esponja.agregar(harina000, new Decimal(80));
  esponja.agregar(agua, new Decimal(60));
  esponja.agregar(levadura, new Decimal(5));
  receta.agregar(harina000, new Decimal(80));
  receta.agregar(harina0000, new Decimal(20));

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
    items = val.map((ti) => ({ name: ti.nombre, value: ti, ...ti }));
  });

  const getTipo = (nombre) => items.find((i) => i.nombre == nombre);
  let _val = 0
$: val = _val;
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
    <Col>% Harinas: {porcentajeHarinas}%

      <ProgressLinear  value={val} />
      <button on:click={()=>_val=_val+1}>{val}</button>
</Col>
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
        <Select dense bind:value={selected} items={$tipos} format={(i) => i.nombre} />
      </Col>

      <Col>
        <Button
          on:click={() => {
            const tipo = selected.esHarina ? new OtroIngrediente(selected) : new Harina(selected);
            receta = receta.agregar(tipo, new Decimal(0));
          }}>
          Agregar
        </Button>
      </Col>
    </Row>
  </Footer>
</div>
