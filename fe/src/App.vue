<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import KeycloakService from "./service/KeycloakService";
</script>

<template>
  <div class="app">
    <header>
      <div class="wrapper">
        <nav>
          <RouterLink to="/" class="nav-link" active-class="active">Home</RouterLink>
          <RouterLink to="/login" class="nav-link" active-class="active">Login</RouterLink>
          <RouterLink to="/allproduct" class="nav-link" active-class="active">All Products</RouterLink>
          <RouterLink to="/Product" class="nav-link" active-class="active">Product</RouterLink>
          <RouterLink to="/categories" class="nav-link" active-class="active">Catagories</RouterLink>
          <RouterLink to="/customer" class="nav-link" active-class="active">Customer</RouterLink>
          <RouterLink to="/order" class="nav-link" active-class="active">Order</RouterLink>
          <RouterLink to="/supplier" class="nav-link" active-class="active">Supplier</RouterLink>
        </nav>
      </div>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
html,
body {
  overflow-y: scroll;
  margin: 0;
  padding: 0;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1000;
  line-height: 1.5;
  max-height: 100vh;
}

main {
  flex: 1;
  padding-top: 1rem;
}


nav {
  font-size: 12px;
  margin-top: 2rem;
  margin: 0 auto;
}

nav a.nav-link {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  text-decoration: none;
  color: var(--color-text);
  transition: color 0.3s, background-color 0.3s;
}

nav a:first-of-type {
  border: 0;
}

nav a.nav-link:hover {
  background-color: var(--color-hover);
}

nav a.active {
  color: var(--color-active);
  font-weight: bold;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
  }
}
</style>
