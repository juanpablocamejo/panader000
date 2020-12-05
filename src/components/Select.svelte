<script lang="ts">
  export let items: { name: String; value: any }[] = [];
  export let label: String;
  export let value: any;
  const id = (+new Date()).toString();
  import { Select } from "svelte-materialify/src";
</script>

<Select {id} bind:value {items}></Select>
