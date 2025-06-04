<template>
    <div class="navbar-container">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">

        <!-- Menú de navegación -->
        <nav class="navbar">
            <div class="navbar-left">
                <img src="../assets/LOGOS DORADOS-02.png" alt="Icono" class="navbar-icon" @click="goHome" width="50%"
                    height="auto" style="cursor: pointer;" />
            </div>
            <div class="navbar-center">
                <h1>{{ pageTitle }}</h1>
                <p>Sistema de Almacén e Inventarios de Radio y Televisión de Hidalgo</p>
            </div>
            <div class="navbar-right">
                <div class="user-profile">
                    <img :src="profileImage" alt="User Profile" class="profile-pic" />
                    <div class="user-info">
                        <p>{{ userName }}</p>
                        <span><a href="profile" style="color: white;">Ver Perfil</a></span>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Barra de navegación amarilla -->
        <div class="sub-navbar">
            <a href="/home" class="nav-item">Inicio</a>

            <!-- Mostrar solo si el usuario NO es de Almacén -->
            <a v-if="userRole === 'Administrador'" href="users" class="nav-item">Administrador</a>

            <!-- Solo mostrar "Almacén" si el usuario tiene el rol de Almacén -->
            <div v-if="userRole === 'Almacenes' || userRole === 'Administrador'" class="nav-item" 
                 @mouseenter="showMenu('almacenMenu')" @mouseleave="hideMenu('almacenMenu')">
                Almacén
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.almacenMenu">
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('existencia')">Entrada de artículos</button>
                    <button @click="navigateTo('articulos')">Existencias</button>
                    <button @click="navigateTo('solicitudmaterial')">Salida de material</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepción de solicitudes</button>
                    <button @click="navigateTo('poliza')">Pólizas</button>
                </div>
            </div>

            <div v-if="userRole === 'Inventario' || userRole === 'Administrador'" class="nav-item" 
                 @mouseenter="showMenu('homeMenu')" @mouseleave="hideMenu('homeMenu')">
                Inventario
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.homeMenu">
                    <button @click="navigateTo('historialbienes')">Historial de bienes</button>
                    <button @click="navigateTo('resguardo')">Bienes sin resguardo</button>
                    <button @click="navigateTo('listaalmacen')">Bienes nuevos</button>
                    <button @click="navigateTo('bienesnuevos')">Asignar resguardo</button>
                    <button @click="navigateTo('liberarbien')">Liberar Bien</button>
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('bajas')">Historial de bajas</button>
                    <button @click="navigateTo('reportes')">Generación de reportes</button>
                </div>
            </div>

            <!-- Menú de usuarios (opcional, solo si es necesario) -->
            <div v-if="showUserMenu" class="nav-item" @mouseenter="showMenu('userMenu')" @mouseleave="hideMenu('userMenu')">
                Usuarios
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.userMenu">
                    <button @click="navigateTo('')">Solicitud de Material</button>
                    <button @click="navigateTo('resguardoUsuario')">Resguardo</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../services/api';
export default {
    name: "NavBarPage",
    props: {
        pageTitle: {
            type: String,
            default: "Sistema"
        },
        showUserMenu: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            userName: "Cargando...",
            profileImage: "",
            userRole: "",
            menus: {
                homeMenu: false,
                userMenu: false,
                settingsMenu: false,
                almacenMenu: false,
            }
        };
    },
    mounted() {
        this.loadUserData();
    },
    methods: {
        navigateTo(page) {
            this.$router.push({ name: page });
        },
        goHome() {
            this.$router.push('/home');
        },
        async loadUserData() {
            const storedUserName = localStorage.getItem("userName");
            const storedUserEmail = localStorage.getItem("userEmail");
            const storedUserRole = localStorage.getItem("userRole");
            
            if (storedUserName && storedUserEmail) {
                this.userName = storedUserName;
                this.userRole = storedUserRole;
                
                try {
                    const response = await api.get('/personas');
                    const users = await response.json();
                    const user = users.find(u => u.email === storedUserEmail);
                    
                    if (user) {
                        const fullName = `${user.nombre || storedUserName} ${user.apellidos || ""}`.trim();
                        this.userName = fullName;
                        
                        const imagePath = user.imagen;
                        let imageFileName = imagePath?.split('\\').pop();
                        
                        if (imageFileName) {
                            imageFileName = imageFileName.split('.').slice(0, -1).join('.');
                        }
                        
                        if (imageFileName) {
                            this.profileImage = `http://192.168.10.31:3000/api/users-files/${imageFileName}`;
                        } else {
                            this.profileImage = "../assets/UserHombre.png";
                        }
                    } else {
                        this.profileImage = "../assets/UserHombre.png";
                    }
                } catch (error) {
                    console.error('Error al cargar los datos del usuario:', error);
                    this.profileImage = "../assets/UserHombre.png";
                }
            } else {
                this.userName = "Usuario desconocido";
                this.profileImage = "../assets/UserHombre.png";
            }
        },
        showMenu(menuName) {
            this.menus[menuName] = true;
        },
        hideMenu(menuName) {
            this.menus[menuName] = false;
        }
    }
};
</script>

<style scoped>
/* Aplicar Montserrat a todo el contenido */
* {
    font-family: 'Montserrat', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Contenedor principal del navbar */
.navbar-container {
    width: 100%;
    flex-shrink: 0;
}

/* Menú de navegación */
.navbar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 20px;
    background: #691B31;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    min-height: 60px;
}

.navbar-left {
    flex: 1;
    display: flex;
    align-items: center;
    margin-top: 60px;
    
}

.navbar-center {
    flex: 3;
    text-align: center;
    margin-top: 60px;
    
    
}

.navbar-center h1 {
    margin: 0;
    font-size: 24px;
    color: white;
}

.navbar-center p {
    margin: 0;
    font-size: 18px;
    color: white;
}

.navbar-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    margin-top: 60px;
}

.user-profile {
    display: flex;
    align-items: center;
}

.profile-pic {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin-right: 10px;
}

.user-info p {
    margin: 0;
    font-weight: bold;
    color: white;
}

.user-info span {
    font-size: 12px;
    color: #ddd;
}

/* Barra de navegación amarilla */
.sub-navbar {
    display: flex;
    justify-content: center;
    background: linear-gradient(to right, #FFFFFF, #DDC9A3);
    padding: 10px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.nav-item {
    position: relative;
    margin: 0 20px;
    cursor: pointer;
    font-size: 16px;
    color: #691B31;
    text-decoration: none;
}

.nav-item:hover {
    color: #590d22;
}

.dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #691B31;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    width: 150px;
    z-index: 1000;
}



.dropdown-menu button {
    width: 100%;
    padding: 10px;
    border: none;
    background: #691B31;
    color: white;
    text-align: left;
    font-size: 14px;
    cursor: pointer;
    border-radius: 25px;
}

.dropdown-menu button:hover {
    background: #590d22;
}

.nav-item:hover .dropdown-menu {
    display: block;
}

.menu-icon {
    margin-left: 5px;
    font-size: 12px;
}



</style>