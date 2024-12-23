import { createRouter, createWebHistory } from "vue-router";
import crud from "@/views/crud.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "crud",
      component: crud,
    },
  ],
});

export default router;
