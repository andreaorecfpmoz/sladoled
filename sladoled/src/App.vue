<template>
  <v-app>
    <v-app-bar color="white" dark app>
      <v-toolbar-title>
        Sladoledarnica
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/">
        Početak
      </v-btn>
      <v-btn to="/sladoledi">
        Lista Sladoleda
      </v-btn>
    </v-app-bar>

    <div class="banner">
      <h1 class="banner-text">Dobrodošli na stranicu posvećenu sladoledima!</h1>
    </div>

    <router-view />

    <v-footer color="white" app>
      <v-col class="text-center" cols="12">
        ©2023 - Sladoledarnica
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.banner {
  background-image: url("./assets/ice-cream.png");
  background-size: cover;
  background-position: center;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-text {
  color: white;
  font-size: 32px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
