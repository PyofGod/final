import { createRouter, createWebHistory } from "vue-router";
import crud from "@/views/crud.vue";
import login from "@/views/Login.vue";
import product from "@/views/product.vue";
import categories from "@/views/categories.vue";
import employee from "@/views/employee.vue";
import customer from "@/views/customer.vue";
import order from "@/views/order.vue";
import supplier from "@/views/supplier.vue";

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
    },
    {
      path: "/customer",
      name: "customer",
      component: customer,
    },
    {
      path: "/order",
      name: "order",
      component: order,
    },
    {
      path: "/supplier",
      name: "supplier",
      component: supplier,
    }
  ],
});

export default router;
