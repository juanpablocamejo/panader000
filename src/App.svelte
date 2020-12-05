<script lang="ts">
import Receta  from "./components/Receta.svelte";
import {MaterialApp} from 'svelte-materialify';
let theme: any = 'light';
</script>

<div class="App">
    <MaterialApp {theme}>
        <h2>Panader000</h2>
        <Receta/>
    </MaterialApp>
</div>

