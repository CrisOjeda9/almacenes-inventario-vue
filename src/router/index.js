import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/components/login.vue'; // Cambia el nombre aquí
import RegistroPage from '@/components/register.vue';
import ProfilePage from '@/components/profile.vue';
import changePassword from '@/components/changePassword.vue';


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage, // Cambia el nombre aquí
    },
    {
      path: '/register',
      name:'register',
      component: RegistroPage, // Cambia el nombre aquí
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage, // Cambia el nombre aquí
    },
    {
      path:'/newpassword',
      name: 'newpassword',
      component: changePassword, // Cambia el nombre aquí
    }
  ],
});

export default router;
