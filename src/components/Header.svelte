<script lang="ts">
  import {
    Col,
    Row,
    Button,
    Icon,
    Menu,
    ListItem,
  } from "svelte-materialify/src";
  import { User } from "sveltefire";
</script>

<Row>
  <Col>
    <Button fab depressed>
      <Icon class="mdi mdi-menu" />
    </Button>
  </Col>
  <Col><h4>Panader000</h4></Col>
  <Col>
    <User let:user let:auth>
      <Button on:click={() => auth.signOut()}>Salir</Button>
    </User>
    <Menu right>
      <div slot="activator">
        <Button fab depressed>
          <Icon class="mdi mdi-dots-vertical" />
        </Button>
      </div>
      <ListItem>Item 1</ListItem>
      <ListItem>Item 2</ListItem>
      <ListItem>Item 3</ListItem>
    </Menu>
  </Col>
</Row>
