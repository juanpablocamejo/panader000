<script lang="ts">
  import Receta from "./components/Receta.svelte";
  import { MaterialApp } from "svelte-materialify";
  let theme: any = "light";
  import { Router, Route, Link } from "svelte-routing";
  import Home from "./routes/Home.svelte";

  // Firebase
  import firebase from "firebase/app";
  import "firebase/firestore";
  import "firebase/auth";
  import "firebase/performance";
  import "firebase/analytics";
  import { FirebaseApp, User } from "sveltefire";
  import { firebaseConfig } from "./config/firebase";
  import { Container, Row, Col, Button } from "svelte-materialify/src";
  firebase.initializeApp(firebaseConfig);
  const authProvider = new firebase.auth.GoogleAuthProvider();

  export let url = ""; //This property is necessary declare to avoid ignore the Router
  import Header from "./components/Header.svelte"
</script>

<div class="App">
  <h6>asdf</h6>
  <FirebaseApp {firebase}>      
      <User let:user let:auth>
                  <div slot="signed-out">
                    <Button on:click={() => auth.signInWithPopup(authProvider)}>Acceder
                      con google</Button>
                  </div>
                  <Header></Header>
      <Router {url}>
        <Route path="/">
          <Home />
        </Route>
        <Route path="recetas" />
        <Route path="recetas/:id/editar" />
        <Route path="recetas/:id/usar" />
      </Router>
    </User>
  </FirebaseApp>
</div>
