import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/components/login.vue'; // Cambia el nombre aquí
import RegistroPage from '@/components/register.vue';
import ProfilePage from '@/components/profile.vue';
import changePassword from '@/components/changePassword.vue';
import homePage from '@/components/home.vue';
import inventoryPage from '@/components/inventory.vue';
import almacenPage from '@/components/almacen.vue';
import usersPage from '@/components/users.vue';
import bajasPage from '@/components/bajas.vue';
import resguardoPage from '@/components/resguardo.vue';



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
    },
    {
      path: '/home',
      name: 'home',
      component: homePage, // Cambia el nombre aquí
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: inventoryPage, // Cambia el nombre aquí
    },
    {
      path: '/almacen',
      name: 'almacen',
      component: almacenPage, // Cambia el nombre aquí
    }
    ,
    {
      path: '/users',
      name: 'users',
      component: usersPage, // Cambia el nombre aquí
    },
    {
      path: '/bajas',
      name: 'bajas',
      component: bajasPage, // Cambia el nombre aquí
    },
    {
      path: '/resguardo',
      name:'resguardo',
      component: resguardoPage, // Cambia el nombre aquí
    }
  ],
});

export default router;
