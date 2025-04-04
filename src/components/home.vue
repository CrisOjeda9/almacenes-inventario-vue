<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">

    <div class="container">
        <!-- Menú de navegación -->
        <nav class="navbar">
            <div class="navbar-left">
                <img src="../assets/LOGOS DORADOS-02.png" alt="Icono" class="navbar-icon" @click="goHome" width="50%"
                    height="auto" style="cursor: pointer;" />
            </div>
            <div class="navbar-center">
                <h1>Bienvenido</h1>
                <p>Sistema de Almacén e Inventarios de Radio y Televisión de Hidalgo</p>
            </div>
            <div class="navbar-right">
                <div class="user-profile">
                    <img :src="profileImage" alt="User Profile" class="profile-pic" />
                    <div class="user-info">
                        <p>{{ userName }} {{ apellidos }}</p> <!-- Nombre dinámico del usuario -->
                        <span><a href="profile" style="color: white;">Ver Perfil</a></span>
                    </div>
                </div>
            </div>

        </nav>

        <!-- Menú de navegación -->
        <div class="sub-navbar">
            <a href="/home" class="nav-item" style="color: #6f7271;">Inicio</a>
            <a v-if="userRole === 'Administrador'" href="users" class="nav-item">Usuarios</a>

            <!-- Se muestra solo si es Administrador o Inventario -->
            <div v-if="userRole === 'Inventario' || userRole === 'Administrador' || userRole === 'Usuario'"
                class="nav-item" @mouseenter="showMenu('homeMenu')" @mouseleave="hideMenu('homeMenu')">
                Inventario
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.homeMenu">
                    <!-- Mostrar todas las opciones para Administrador e Inventario -->
                    <template v-if="userRole === 'Inventario' || userRole === 'Administrador'">
                        <button @click="navigateTo('bajas')">Historial de bajas</button>
                        <button @click="navigateTo('historialbienes')">Historial de bienes</button>
                        <button @click="navigateTo('bajabien')">Baja de bienes</button>
                        <button @click="navigateTo('resguardo')">Bienes sin resguardo</button>
                        <button @click="navigateTo('listaalmacen')">Asignar No. Inventario</button>
                        <button @click="navigateTo('bienesnuevos')">Asignar resguardo</button>
                        <button @click="navigateTo('liberarbien')">Liberar Bien</button>
                        <button @click="navigateTo('reportes')">Generación de reportes</button>
                    </template>

                    <!-- Mostrar solo "Bienes sin resguardo" para Usuario -->
                    <template v-if="userRole === 'Usuario'">
                        <button @click="navigateTo('resguardo')">Bienes sin resguardo</button>
                    </template>
                </div>
            </div>

            <!-- Se muestra solo si es Almacenes o Administrador -->
            <div v-if="userRole === 'Almacenes' || userRole === 'Administrador'" class="nav-item"
                @mouseenter="showMenu('usersMenu')" @mouseleave="hideMenu('usersMenu')">
                Almacén
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.usersMenu">
                    <button @click="navigateTo('solicitudmaterial')">Salida de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('existencia')">Entrada de artículos</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepción de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('poliza')">Pólizas</button>
                </div>
            </div>
        </div>

        <div class="menu">
            <!-- Control Inventario (solo Inventario y Administrador) -->
            <div v-if="userRole === 'Inventario' || userRole === 'Administrador' || userRole === 'Usuario'" class="button-card"
                @click="navigateTo2('inventory')">
                <i class="fas fa-box"></i>
                <span>Control inventario</span>
            </div>

            <!-- Gestión de Usuarios (solo Administrador) -->
            <div v-if="userRole === 'Administrador'" class="button-card" @click="navigateTo2('users')">
                <i class="fas fa-users"></i>
                <span>Gestión de Usuarios</span>
            </div>

            <!-- Almacén (solo Almacenes y Administrador) -->
            <div v-if="userRole === 'Almacenes' || userRole === 'Administrador'" class="button-card"
                @click="navigateTo2('almacen')">
                <i class="fas fa-warehouse"></i>
                <span>Almacén</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "homePage",
    data() {
        return {
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario

            menus: {
                homeMenu: false,
                usersMenu: false,
            },
            userRole: localStorage.getItem('userRole') || '', // Obtener el rol desde el localStorage
        };
    },
    mounted() {
        this.loadUserData();
    },
    methods: {
        async loadUserData() {
            const storedUserName = localStorage.getItem("userName");
            const storedUserEmail = localStorage.getItem("userEmail");

            if (storedUserName && storedUserEmail) {
                this.userName = storedUserName;

                try {
                    // Obtener todos los usuarios de la API
                    const response = await fetch('http://localhost:3000/api/personas');
                    const users = await response.json();

                    // Buscar el usuario logueado por email
                    const user = users.find(u => u.email === storedUserEmail);

                    if (user) {
                        // Concatenar nombre y apellidos
                        const fullName = `${user.nombre || storedUserName} ${user.apellidos || ""}`.trim();
                        this.userName = fullName;

                        // Obtener la ruta completa de la imagen del usuario
                        const imagePath = user.imagen; // Suponiendo que la API devuelve la ruta completa

                        // Extraer el nombre del archivo de la ruta completa
                        let imageFileName = imagePath.split('\\').pop(); // Extrae "radio2.jpg"

                        // Eliminar la extensión del nombre del archivo
                        if (imageFileName) {
                            imageFileName = imageFileName.split('.').slice(0, -1).join('.'); // Elimina la extensión
                        }

                        if (imageFileName) {
                            // Construir la URL completa para la imagen
                            this.profileImage = `http://localhost:3000/api/users-files/${imageFileName}`;
                        } else {
                            // Usar una imagen por defecto si no hay imagen en la API
                            this.profileImage = "../assets/UserHombre.png";
                        }
                    } else {
                        this.profileImage = "../assets/UserHombre.png"; // Imagen por defecto
                    }
                } catch (error) {
                    console.error('Error al cargar los datos del usuario:', error);
                    this.profileImage = "../assets/UserHombre.png"; // Imagen por defecto en caso de error
                }
            } else {
                this.userName = "Usuario desconocido";
                this.profileImage = "../assets/UserHombre.png"; // Imagen por defecto
            }
        },
        goBack() {
            console.log("Regresar a la página anterior");
        },
        navigateTo(page) {
            console.log(`Navegando a ${page}`);
            this.$router.push({ name: page });
        },
        showMenu(menu) {
            this.menus[menu] = true;
        },
        hideMenu(menu) {
            this.menus[menu] = false;
        },
        navigateTo2(route) {
            this.$router.push({ name: route });
        }
    }
};
</script>

<style scoped>
/* Aplicar Montserrat a todo el contenido */
* {
    font-family: 'Montserrat', sans-serif;
}

.titulo {
    font-size: 30px;
    font-weight: 100;
    text-align: center;
}

.container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    background: linear-gradient(to bottom, #000000, #691B31);
    flex-direction: column;
    color: white;
}

/* Menú de navegación */
.navbar {
    position: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background: #691B31;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.navbar-left {
    flex: 1;
    display: flex;
    align-items: center;
}

.icon-back {
    font-size: 24px;
    cursor: pointer;
    margin-right: 10px;
    color: white;
}

.navbar-center {
    flex: 3;
    text-align: center;
}

.navbar-center h1 {
    margin: 0;
    font-size: 24px;
}

.navbar-center p {
    margin: 0;
    font-size: 14px;
}


.navbar-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
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
    /* Degradado de izquierda a derecha */
    padding: 10px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.nav-item {
    position: relative;
    margin: 0 20px;
    cursor: pointer;
    font-size: 16px;
    color: #691B31;
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

    /* Asegurar que esté encima */
}

.dropdown-menu button {
    width: 100%;
    padding: 10px;
    border: none;
    background: #691B31;
    color: white;
    text-align: left;
    font-size: 14px;

}

.dropdown-menu button:hover {
    background: #590d22;
}

.nav-item:hover .dropdown-menu {
    display: block;
}






button {
    width: 60%;
    padding: 15px;
    background: #870f33;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    background: #590d22;
}

.button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}


label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    color: #691B31;
}

.input-wrapper {
    position: relative;
}

.input-wrapper input {
    width: 100%;
    /* Espacio para el ícono */
}

.input-wrapper i {
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}


a {
    text-decoration: none;
}

.menu {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    /* Espacio entre los botones */
}

.button-card {
    width: 260px;
    height: 140px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
    /* Gradiente suave */
    color: #691B31;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    /* Sombra sutil */
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
    /* Transición suave */
}

.button-card:hover {
    transform: translateY(-10px);
    /* Desplazamiento suave hacia arriba */
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    /* Sombra más profunda */
}

.button-card i {
    font-size: 50px;
    margin-bottom: 15px;
    transition: transform 0.3s ease, color 0.3s ease;
    /* Efecto de cambio suave */
}

.button-card:hover i {
    transform: scale(1.2);
    /* Escala suave */
    color: #bc955b;
    /* Color dorado en hover */
}

.button-card span {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    transition: color 0.3s ease;
    /* Cambio de color en hover */
}

.button-card:hover span {
    color: #bc955b;
    /* Color dorado en hover */
}

.button-card:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: scaleX(0);
    transform-origin: 100% 100%;
    transition: transform 0.4s ease;
    /* Efecto de barra sutil */
}

.button-card:hover:before {
    transform: scaleX(1);
    /* Expande la capa al hacer hover */
}


.badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #870f33;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}
</style>