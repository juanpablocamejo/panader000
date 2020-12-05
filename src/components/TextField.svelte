<script lang="ts">
  export let label: String;
  export let value:any;
  export let inputProps: any;
  const id = (+new Date()).toString();
  import {TextField} from 'svelte-materialify';
</script>

<TextField {id} bind:value={value} {...inputProps} on:input={console.log} on:blur />
