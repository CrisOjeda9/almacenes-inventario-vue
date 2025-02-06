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
                <h1>Salida de existencias</h1>
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
                    <button @click="navigateTo('bajas')"
                        style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Historial de
                        bajas</button>
                    <button @click="navigateTo('historialbienes')">Historial de bienes</button>
                    <button @click="navigateTo('home')">Alta de bienes</button>
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Mi resguardo</button>
                    <button @click="navigateTo('listaalmacen')">Lista Almacén para asignar No.Inventario</button>
                    <button @click="navigateTo('')">Lista Bienes con No.Inventario para asignar Usuario</button>
                    <button @click="navigateTo('reportes')">Generación de Formatos/Reportes</button>
                    <button @click="navigateTo('bienesnuevos')">Bienes nuevos para resguardo</button>
                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('bajasMenu')" @mouseleave="hideMenu('bajasMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.bajasMenu">
                    <button @click="navigateTo('solicitudmaterial')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('bajas')">Salida de existencias</button>
                    <button @click="navigateTo('existencia')">Entrada de existencias</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('poliza')">Polizas</button>
                </div>
            </div>
        </div>



        <div class="contenedor-tabla">
            <!-- Nombre del usuario encima de la tabla --> 
             <div class="contenedor-nombre">
                <div class="user-info-display">
                <h3>{{ userName }}</h3>
            </div>
             </div>
            
            
            <table class="bajas-table">
                <thead>
                    <tr>
                        <th>Cantidad solicitada</th>
                        <th>Unidad de medida</th>
                        <th>Descripción del material solicitado</th>
                        <th>Cantidad a entregar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="bajas in paginatedBajas" :key="bajas.id">
                        <td>{{ bajas.cantidadSolicitada }}</td>
                        <td>{{ bajas.unidadMedida }}</td>
                        <td>{{ bajas.descripcionMaterial }}</td>
                        <td>
                            <input type="number" min="0" v-model="bajas.cantidadEntregar" class="input-edit" />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="button-container">
                <button class="boton" type="submit">
                    <i class="fas fa-paper-plane"></i> Enviar
                </button>
            </div>
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
    name: "salidaExistenciasPage",
    data() {
        return {
            menus: {
                homeMenu: false,
                bajasMenu: false,
                settingsMenu: false,
            },
            userName: "Random User xd", // Aquí puedes poner dinámicamente el nombre del usuario
            searchQuery: '',
            bajas: [
                { cantidadSolicitada: 10, unidadMedida: 'kg', descripcionMaterial: 'Material A', cantidadEntregar: 5 },
                { cantidadSolicitada: 20, unidadMedida: 'm', descripcionMaterial: 'Material B', cantidadEntregar: 8 },
                { cantidadSolicitada: 15, unidadMedida: 'l', descripcionMaterial: 'Material C', cantidadEntregar: 3 },
            ],
            itemsPerPage: 10,
            currentPage: 1,
            filterTerm: '',
        };
    },
    computed: {
        filteredBajas() {
            return this.bajas.filter(bajas => {
                const query = this.searchQuery.toLowerCase();
                return bajas.descripcionMaterial.toLowerCase().includes(query) ||
                    bajas.unidadMedida.toLowerCase().includes(query);
            });
        },
        totalPages() {
            return Math.ceil(this.filteredBajas.length / this.itemsPerPage);
        },
        paginatedBajas() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredBajas.slice(start, end);
        },
    },
    methods: {
        goHome() {
            this.$router.push('home');
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

.user-info-display {
    text-align: center;
    width: 200px;
    height: 60px;
    background-color: white;
    margin-bottom: 20px;
    font-size: 15px;
    font-weight: bold;
    color: #691B31;
    border-radius: 20px;
}

.contenedor-nombre{
    display: flex;
    width: 80%;
    height: 60px;
    margin-bottom: 10px;
}

.contenedor-tabla {
    display: flex;
    align-items: left;
}

.input-edit {
    text-align: center;
    border: none;
    background-color: #dcdcdc;
    color: #691B31;
    border-radius: 5px;
    padding: 5px;
    width: 100px;
    box-sizing: border-box;
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
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 20px;
}

.boton {
    width: 400px;

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

.bajas-table {
    width: 80%;
    border-collapse: separate;
    border-spacing: 0;
    background-color: white;
    color: #691B31;
    border-radius: 15px;
    /* Redondear las esquinas de la tabla */
    overflow: hidden;
    /* Para que los bordes no sobresalgan */
}

.bajas-table th,
.bajas-table td {
    padding: 10px;
    text-align: center;
}

.bajas-table th {
    background-color: #BC955B;
    color: white;
}

.bajas-table tr:hover {
    background-color: #70727265;
    color: #A02142;
    transition: background-color 0.3s ease;
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
</style>