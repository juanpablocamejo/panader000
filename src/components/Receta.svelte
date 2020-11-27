<script lang="ts">
  import { Receta } from "../models/Receta";
  import ListaIngredientes from "./ListaIngredientes.svelte";
  import type { Ingrediente } from "../models/Ingrediente";
  import type { Harina, OtroIngrediente, TipoIngrediente } from "../models/TipoIngrediente";
 import { tiposHarinas, tiposIngredientes, tiposPrefermentos } from "../models/Store";
import type { Prefermento } from "../models/Prefermento";

// const app:Application= Application.GetInstance();
//   const [tiposHarinas, tiposIngredientes, tiposPrefermentos] = [
//     app.ObtenerTipos<Harina>(StoreTypes.TipoHarina),
//     app.ObtenerTipos<OtroIngrediente>(StoreTypes.TipoIngrediente),
//     app.ObtenerTipos<Prefermento>(StoreTypes.TipoPrefermento),
//     ]
  let receta = new Receta();
  let harinas: Ingrediente<Harina>[] = [];
  let ingredientes: Ingrediente<OtroIngrediente>[] = [];
  let prefermentos: Ingrediente<TipoIngrediente>[] = [];
  let harinasCompleto = false;
  $: harinas = receta.harinas();
  $: ingredientes = receta.ingredientes();
  $: prefermentos = receta.prefermentos();
  $: cantHarinas = harinas.reduce((sum, x) => +sum + +x.proporcion, 0);
  $: harinasCompleto = receta.porcentajeCargaHarinas() == 100;
  function agregarTipoHarina(evt:CustomEvent){
    console.log("agregar tipo de harina",evt)
    // app.AgregarTipo(StoreTypes.TipoHarina,evt.detail);
  }
</script>

<div class="container mx-auto px-4">
  <div class="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4"><p>{receta.porcentajeCargaHarinas()}</p>
    <ListaIngredientes
      on:add={() => {
        receta = receta.agregarHarina();
        console.log(harinas);
      }}
      on:change={evt=>{
        console.log('receta - change',evt)
        harinasCompleto = receta.porcentajeCargaHarinas() == 100
      }}
      on:save={agregarTipoHarina}
      on:remove={(evt)=>{
        console.log('eliminarHarina',evt.detail);
        receta = receta.eliminarHarina(evt.detail);
        console.log(harinas);
      }}
      titulo="Harina/s"
      deshabilitarCarga={harinasCompleto}
      valor={harinas}
      tipos={$tiposHarinas} />
    <fieldset disabled={!harinasCompleto}>
    <ListaIngredientes
      on:add={() => (receta = receta.agregarPrefermento())}
      titulo="Prefermento/s"      
      valor={prefermentos}
      tipos={$tiposPrefermentos}
      deshabilitarCarga={false} />
    <ListaIngredientes
      on:add={() => (receta = receta.agregarIngrediente())}
      titulo="Otros Ingredientes"
      valor={ingredientes}
      tipos={$tiposIngredientes}
      deshabilitarCarga={false} />
    </fieldset>
  </div>
</div>
