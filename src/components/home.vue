<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">


    <div class="container">
        <!-- Menú de navegación -->
        <nav class="navbar">
            <div class="navbar-left">
                <!-- Ícono local -->
                <img src="../assets/LOGOS DORADOS-02.png" alt="Icono" class="navbar-icon" @click="goBack" width="50%px"
                    height="auto" />
            </div>
            <div class="navbar-center">
                <h1>Bienvenido</h1>
                <p>Sistema inventario y Almacén de Radio y Televisión de Hidalgo</p>
            </div>
            <div class="navbar-right">
                <div class="user-profile">
                    <img src="../assets/UserHombre.png" alt="User Profile" class="profile-pic" />
                    <div class="user-info">
                        <p>Random user xd</p>
                        <span><a href="profile" style="color: white;">Ver Perfil</a></span>
                    </div>
                </div>
            </div>
        </nav>


        <!-- Barra de navegación amarilla -->
        <div class="sub-navbar">
            <a href="/home" class="nav-item">Inicio</a>
            <a href="users" class="nav-item">Usuarios</a>
            <div class="nav-item" @mouseenter="showMenu('homeMenu')" @mouseleave="hideMenu('homeMenu')">
                Inventario
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.homeMenu">
                    <button @click="navigateTo('bajas')">Historial de bajas</button>
                    <button @click="navigateTo('home')">Alta de bienes</button>
                    <button @click="navigateTo('home')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Mi resguardo</button>
                    <button @click="navigateTo('home')">Facturas</button>
                    <button @click="navigateTo('home')">Polizas</button>
                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('usersMenu')" @mouseleave="hideMenu('usersMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.usersMenu">
                    <button @click="navigateTo('users')">Solicitud de material</button>
                    <button @click="navigateTo('users')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('users')">Salida de existencias</button>
                    <button @click="navigateTo('users')">Entrada de existencias</button>
                    <button @click="navigateTo('users')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('users')">Ver proveedores</button>
                </div>
            </div>

        </div>
        <div class="menu">
            <!-- Botón 1: Control inventario -->
            <div class="button-card" @click="navigateTo2('inventory')">
                <i class="fas fa-box"></i>
                <span>Control inventario</span>
            </div>

            <!-- Botón 3: Gestión de Usuarios -->
            <div class="button-card" s @click="navigateTo2('users')">
                <i class="fas fa-users"></i>
                <span>Gestión de Usuarios</span>
            </div>

            <!-- Botón 4: Almacén -->
            <div class="button-card" @click="navigateTo2('almacen')">
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
            menus: {
                homeMenu: false,
                usersMenu: false,
                settingsMenu: false,
            },
        };
    },
    methods: {
        goBack() {
            console.log("Regresar a la página anterior");
        },

        navigateTo(page) {
            console.log(`Navegando a ${page}`);
            this.$router.push({ name: page }); // Asegúrate de que las rutas estén definidas con `name`.
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
    },
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
    width: 99vw;
    height: 97.5vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(to bottom, #000000, #691B31);
    color: white;
    overflow: hidden;
}

/* Menú de navegación */
.navbar {
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

    display: flex;
    justify-content: center;
    gap: 20px;
    /* Espacio entre los botones */
    margin-top: 12%;
}

.button-card {
    width: 260px;
    height: 140px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #FFFFFF; /* Gradiente suave */
    color: #691B31;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); /* Sombra sutil */
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease; /* Transición suave */
}

.button-card:hover {
    transform: translateY(-10px); /* Desplazamiento suave hacia arriba */
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2); /* Sombra más profunda */
}

.button-card i {
    font-size: 50px;
    margin-bottom: 15px;
    transition: transform 0.3s ease, color 0.3s ease; /* Efecto de cambio suave */
}

.button-card:hover i {
    transform: scale(1.2); /* Escala suave */
    color: #bc955b; /* Color dorado en hover */
}

.button-card span {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    transition: color 0.3s ease; /* Cambio de color en hover */
}

.button-card:hover span {
    color: #bc955b; /* Color dorado en hover */
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
    transition: transform 0.4s ease; /* Efecto de barra sutil */
}

.button-card:hover:before {
    transform: scaleX(1); /* Expande la capa al hacer hover */
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