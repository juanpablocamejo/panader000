<script lang="ts">
     export let items:{text:String, value:any}[]=[];
     export let label:String
     export let value:any
     const id = (+new Date()).toString();
     import {Input} from 'sveltestrap';
</script>
<div class="select-div">
        {#if label}<label for={id}>{label}</label>{/if}
    <Input type="select" id={id} bind:value={value}>
        {#each items as itm }
        <option value={itm.value}>{itm.text}</option>
        {/each}
    </Input>
</div>