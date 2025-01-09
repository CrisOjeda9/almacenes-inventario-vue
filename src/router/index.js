import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/components/login.vue'; // Cambia el nombre aquí

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage, // Cambia el nombre aquí
    },
  ],
});

export default router;
