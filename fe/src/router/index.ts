import { createRouter, createWebHistory } from "vue-router";
import crud from "@/views/crud.vue";
import login from "@/views/Login.vue";
import product from "@/views/product.vue";
import categories from "@/views/categories.vue";
import employee from "@/views/employee.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "crud",
      component: crud,
    },
    {
      path: "/login",
      name: "login",
      component: login,
    },
    {
      path: "/product",
      name: "product",
      component: product,
    },
    {
      path: "/categories",
      name: "categories",
      component: categories,
    },
    {
      path: "/employee",
      name: "employee",
      component: employee,
    }
  ],
});

export default router;
