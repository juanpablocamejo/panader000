<script lang="ts">
  export let label: String;
  export let value:any;
  export let inputProps: any;
  const id = (+new Date()).toString();
  import {Input} from 'sveltestrap';
</script>

<div class="input-div">
  {#if label}<label for={id}>{label}</label>{/if}
  <Input {id} bind:value={value} {...inputProps} on:input={console.log} />
</div>
