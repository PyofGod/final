import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import KeyCloakService from "./service/KeycloakService";
import HttpService from "./service/HttpService";

const app = createApp(App);

app.use(createPinia());
app.use(router);

KeyCloakService.CallLogin(() => {
  app.mount("#app");
});
HttpService.configureAxiosKeycloak();
