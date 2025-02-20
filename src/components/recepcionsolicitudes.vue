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
                <h1>Recepcion de Solicitudes

                </h1>
                <p>Sistema inventario y Almacén de Radio y Televisión de Hidalgo</p>
            </div>
            <div class="navbar-right">
                <div class="user-profile">
                    <img src="../assets/UserHombre.png" alt="User Profile" class="profile-pic" />
                    <div class="user-info">
                        <p>{{ userName }}</p> <!-- Nombre dinámico del usuario -->
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
                    <button @click="navigateTo('historialbienes')">Historial de bienes</button>
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Bienes sin resguardo</button>
                    <button @click="navigateTo('listaalmacen')">Asignar No.Inventario</button>
                    <button @click="navigateTo('reportes')">Generación de reportes</button>
                    <button @click="navigateTo('bienesnuevos')">Asignar resguardo</button>



                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('SolicitudMenu')" @mouseleave="hideMenu('SolicitudMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.SolicitudMenu">
                    <button @click="navigateTo('solicitudmaterial')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('existencia')">Entrada de existencias</button>
                    <button @click="navigateTo('recepcionsolicitudes')"
                        style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Recepcion de
                        solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('poliza')">Polizas</button>
                </div>
            </div>

        </div>

        <div class="search-bar">

            <div class="input-wrapper">
                <input type="text" v-model="searchQuery" placeholder="Buscar..." />
                <i class="fas fa-search"></i> <!-- Icono de la lupa -->
            </div>



        </div>

        <div class="contenedor-tabla">
            <table class="solicitudes-table">
                <thead>
                    <tr>
                        <th>Usuario Solicitante</th>
                        <th>Fecha en que llego</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="solicitudes in paginatedSolicitudes" :key="solicitudes.id">
                        <td>{{ solicitudes.name }}</td>
                        <td>{{ solicitudes.registrationDate }}</td>
                        <td>
                            <button @click="redirectToAddsolicitudes" class="btn-existencias">Salida de existencias</button>
                        </td>
                    </tr>
                </tbody>

            </table>
            <!-- Paginador -->
            <div class="pagination">
                <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Anterior</button>
                <span>Página {{ currentPage }} de {{ totalPages }}</span>
                <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">Siguiente</button>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "recepcionSolicitudesPage",
    data() {
        return {
            userName: "Cargando...", // Mensaje temporal
            menus: {
                homeMenu: false,
                SolicitudMenu: false,
                settingsMenu: false,
            },
            searchQuery: '',
            solicitudes: [
                { name: "Cristian", registrationDate: "2024-01-15" },

                // Agrega más usuarios aquí...
            ],
            itemsPerPage: 10, // Cantidad de elementos por página
            currentPage: 1, // Página actual

        };
    },
    computed: {
        filteredSolicitudes() {
            return this.solicitudes.filter(solicitudes => {
                const query = this.searchQuery.toLowerCase();
                return (solicitudes.name.toLowerCase().includes(query));

            });
        },
        // Número total de páginas
        totalPages() {
            return Math.ceil(this.filteredSolicitudes.length / this.itemsPerPage);
        },
        paginatedSolicitudes() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredSolicitudes.slice(start, end);
        },
    },
    mounted() {
        this.loadUserName();
    },
    methods: {
        loadUserName() {
            const storedUserName = localStorage.getItem("userName");
            this.userName = storedUserName ? storedUserName : "Usuario desconocido";
        },
        goHome() {
            this.$router.push('home'); // Redirige a la página principal ("/"). Cambia el path si es necesario.
        },
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
        redirectToAddsolicitudes() {
            // Aquí defines la ruta a la que quieres redirigir al hacer clic en el botón
            this.$router.push('/salidaExistencias');
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
    },
};
</script>

<style scoped>
/* Aplicar Montserrat a todo el contenido */
* {
    font-family: 'Montserrat', sans-serif;
}



.pagination {
    display: flex;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;

}

.pagination button {
    margin-left: 20px;
    margin-right: 20px;
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
    overflow-x: hidden;
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

.solicitudes-table {
    width: 50%;
    border-collapse: separate;
    border-spacing: 0;
    background-color: white;
    color: #691B31;
    border-radius: 15px;
    /* Redondear las esquinas de la tabla */
    overflow: hidden;
    /* Para que los bordes no sobresalgan */
}

.solicitudes-table th,
.solicitudes-table td {
    padding: 10px;
    text-align: center;
}

.solicitudes-table th {
    background-color: #BC955B;
    color: white;
}

.solicitudes-table tr:hover {
    background-color: #70727265;
    color: #A02142;
    transition: background-color 0.3s ease;
}

.btn-existencias{
    width: 120px;
    text-align: center;
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 15px;
    padding-right: 15px;
    border: none;
    cursor: pointer;
}

.btn-existencias {
    background-color: #BC955B;
    color: white;
    margin-bottom: 4px;
}



.btn-existencias:hover {
    background-color: #DDC9A3;
}



.contenedor-tabla {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Barra de búsqueda */
.search-bar {
    margin: 12px 0;
    text-align: center;
}

.input-wrapper {
    position: relative;
    width: 60%;
    display: inline-block;
}

.input-wrapper input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border-radius: 25px;
    border: 1px solid #BC955B;
    background-color: #fff;
}

.input-wrapper i {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #691B31;
    pointer-events: none;
}

.input-wrapper input::placeholder {
    color: #691B31;
}
</style>