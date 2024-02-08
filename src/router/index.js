import { createRouter, createWebHistory } from "@ionic/vue-router";
import Tabs from "@/views/Alunos/Tabs/Tabs.vue";
import LoginAluno from "@/views/Alunos/Login.aluno.vue";
import mobileRoutes from "./mobile.routes";
import useStorage from "@/composables/useStorage";

const routes = [
  {
    path: "/",
    name: "index",
    redirect: { name: "projetos" },
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: () => import("@/views/404/404.vue"),
  },
  {
    path: "/LoginAluno",
    name: "LoginAluno",
    component: LoginAluno,
  },
  {
    path: "/projetos",
    name: "projetos",
    component: () => import("@/views/Projetos.vue"),
    beforeEnter: async (to, from, next) => {
      const storage = useStorage();
      const projeto = await storage.getAsJsonStorage("projeto");
      if (projeto) {
        return next("/loginAluno");
      }
      next();
    },
  },
  {
    path: "/tabs/",
    component: Tabs,
    children: mobileRoutes,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
