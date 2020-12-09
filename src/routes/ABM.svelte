<script lang="ts">
import {MaterialApp} from 'svelte-materialify'
import Receta from '../components/Receta.svelte'
let theme:any = "light"
</script>
<MaterialApp {theme}>
    
    <Receta/>
</MaterialApp>