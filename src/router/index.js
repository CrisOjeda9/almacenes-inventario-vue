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
import facturaPage from '@/components/factura.vue';
import newFacturaPage from '@/components/newfactura.vue';
import polizasPage from '@/components/poliza.vue';
import newPolizaPage from '@/components/newpoliza.vue';
import newProveedorPage from '@/components/newproveedor.vue';
import proveedorPage from '@/components/proveedor.vue';
import newExistenciaPage from '@/components/newexistencia.vue'
import existenciaPage from '@/components/existencia.vue';
import BienPage from '@/components/bieninventario.vue';
import bajaBienPage from '@/components/bajabien.vue';
import recepcionSolicitudesPage from '@/components/recepcionsolicitudes.vue';
import versolicitudesPage from '@/components/versolicitudes.vue';
import bienesnuevosPage from '@/components/bienesnuevos.vue';
import asignarBienPage from '@/components/asignarbienusuario.vue';
import listaAlmacenPage from '@/components/listaalmacen.vue';
import solicitudMaterialPage from '@/components/solicitudmateriales.vue';
import historialBienesPage from '@/components/historialbienes.vue';
import reportesPage from '@/components/reportes.vue';
import salidaExistenciasPage from '@/components/salidaExistencias.vue';
import liberarBienPage from '@/components/liberarBien.vue';
import resguardoUsuarioPage from '@/components/resguardoUsuario.vue';
import articulosPage from '@/components/articulos.vue';
import navBarPage from '@/components/NavBar.vue';

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
      name: 'register',
      component: RegistroPage, // Cambia el nombre aquí
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage, // Cambia el nombre aquí
    },
    {
      path: '/newpassword',
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
      component: inventoryPage,
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
      name: 'resguardo',
      component: resguardoPage, // Cambia el nombre aquí
    },
    {
      path: '/factura',
      name: 'factura',
      component: facturaPage, // Cambia el nombre aquí
    },
    {
      path: '/newfactura',
      name: 'newfactura',
      component: newFacturaPage, // Cambia el nombre aquí
    },
    {
      path: '/poliza',
      name: 'poliza',
      component: polizasPage, // Cambia el nombre aquí
    },
    {
      path: '/newpoliza',
      name: 'newpoliza',
      component: newPolizaPage, // Cambia el nombre aquí
    },
    {
      path: '/proveedor',
      name: 'proveedor',
      component: proveedorPage,
    },
    {
      path: '/newproveedor',
      name: 'newproveedor',
      component: newProveedorPage,
    },
    {
      path: '/newexistencia',
      name: 'newexistencia',
      component: newExistenciaPage, // Cambia el nombre aquí
    },
    {
      path: '/existencia',
      name: 'existencia',
      component: existenciaPage, // Cambia el nombre aquí
    },
    {
      path: '/bieninventario',
      name: 'bieninventario',
      component: BienPage, // Cambia el nombre aquí
    },
    {
      path: '/bajabien',
      name: 'bajabien',
      component: bajaBienPage,
    },
    {
      path: '/recepcionsolicitudes',
      name: 'recepcionsolicitudes',
      component: recepcionSolicitudesPage, // Cambia el nombre aquí
    },
    {
      path: '/versolicitudes',
      name: 'versolicitudes',
      component: versolicitudesPage, // Cambia el nombre aquí
    },
    {
      path: '/bienesnuevos',
      name: 'bienesnuevos',
      component: bienesnuevosPage,
    },
    {
      path: '/asignarbienusuario',
      name: 'asignarbienusuario',
      component: asignarBienPage, // Cambia el nombre aquí
    },
    {
      path: '/listaalmacen',
      name: 'listaalmacen',
      component: listaAlmacenPage, // Cambia el nombre aquí
    },
    {
      path: '/solicitudmaterial',
      name: 'solicitudmaterial',
      component: solicitudMaterialPage,
    },
    {
      path: '/historialbienes',
      name: 'historialbienes',
      component: historialBienesPage,
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: reportesPage,
    },
    {
      path: '/salidaexistencias',
      name: 'salidaexistencias',
      component: salidaExistenciasPage, // Cambia el nombre aquí
    },
    {
      path: '/liberarbien',
      name: 'liberarbien',
      component: liberarBienPage, // Cambia el nombre aquí
    },
    {
      path: '/resguardoUsuario',
      name: 'resguardoUsuario',
      component: resguardoUsuarioPage, // Cambia el nombre aquí
    },
    {
      path: '/articulos',
      name: 'articulos',
      component: articulosPage, // Cambia el nombre aquí
    },
    {
      path: '/NavBar',
      name: '/NavBar',
      component: navBarPage,
    }
  ],
});
// Middleware de autenticación
router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('userRole');

  if (to.meta.role) {
    if (userRole === 'Administrador' || userRole === to.meta.role) {
      next();
    } else {
      alert('No tienes permisos para acceder a esta página.');
      next('/home');
    }
  } else {
    next();
  }
});
export default router;
