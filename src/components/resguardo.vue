<template>

    <body>

    </body>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">

    <div class="container">
        <!-- Menú de navegación -->
        <nav class="navbar">
            <div class="navbar-left">
                <img src="../assets/LOGOS DORADOS-02.png" alt="Icono" class="navbar-icon" @click="goBack" width="50%"
                    height="auto" />
            </div>
            <div class="navbar-center">
                <h1>Resguardo</h1>
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

        <div class="search-bar">
            <div class="input-wrapper">
                <input type="text" v-model="searchQuery" placeholder="Buscar..." />
                <i class="fas fa-search"></i> <!-- Icono de la lupa -->
            </div>



        </div>
        <!-- Botones de descarga -->
        <div class="download-buttons">
            <button @click="downloadPDF"
                style="background-color: red;">
                <i class="fas fa-file-pdf" style="margin-right: 8px;"></i>
                Descargar PDF
            </button>
            <button @click="downloadExcel"
                style="background-color: green;">
                <i class="fas fa-file-excel" style="margin-right: 8px;"></i>
                Descargar Excel
            </button>
        </div>


        <div class="contenedor-tabla">
            <table class="user-table">
                <thead>
                    <tr>
                        <th>No. Bien</th>
                        <th>Cuenta Bancaria</th>
                        <th>No. Poliza</th>
                        <th>Persona</th>
                        <th>Costo Unitario</th>
                        <th>RFC</th>
                        <th>Dirección</th>
                        <th>Tipo de Compra</th>
                        <th>Fecha de compra</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in paginatedBajas" :key="user.id">
                        <td>{{ user.numerobien }}</td>
                        <td>{{ user.cuentabancaria }}</td>
                        <td>{{ user.poliza }}</td>
                        <td>{{ user.persona }}</td>
                        <td>{{ user.costounitario }}</td>
                        <td>{{ user.rfc }}</td>
                        <td>{{ user.direccion }}</td>
                        <td>{{ user.tipocompra }}</td>
                        <td>{{ user.registrationDate }}</td>

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
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default {
    name: "resguardoPage",
    data() {
        return {
            menus: {
                homeMenu: false,
                usersMenu: false,
                settingsMenu: false,
            },
            searchQuery: '',
            users: [
                { numerobien: "15051", cuentabancaria: "526452658758985785", poliza: "adasd4654", persona: "Moral", costounitario: "100.00", rfc: "hsadjhasd4", direccion: "asdad456564", tipocompra: "Presupuestal", registrationDate: "2024-01-15" },
                { numerobien: "45661", cuentabancaria: "757586867478932473", poliza: "asd66ddd", persona: "Fisica", costounitario: "200.00", rfc: "jghfgddjgdk4", direccion: "asdad5456", tipocompra: "Estatal", registrationDate: "2024-01-15" },
                { numerobien: "45661", cuentabancaria: "757586867478932473", poliza: "asd66ddd", persona: "Fisica", costounitario: "200.00", rfc: "jghfgddjgdk4", direccion: "asdad5456", tipocompra: "Estatal", registrationDate: "2024-01-15" },
                { numerobien: "45661", cuentabancaria: "757586867478932473", poliza: "asd66ddd", persona: "Fisica", costounitario: "200.00", rfc: "jghfgddjgdk4", direccion: "asdad5456", tipocompra: "Estatal", registrationDate: "2024-01-15" },
                { numerobien: "45661", cuentabancaria: "757586867478932473", poliza: "asd66ddd", persona: "Fisica", costounitario: "200.00", rfc: "jghfgddjgdk4", direccion: "asdad5456", tipocompra: "Estatal", registrationDate: "2024-01-15" },
                { numerobien: "45661", cuentabancaria: "757586867478932473", poliza: "asd66ddd", persona: "Fisica", costounitario: "200.00", rfc: "jghfgddjgdk4", direccion: "asdad5456", tipocompra: "Estatal", registrationDate: "2024-01-15" },
                { numerobien: "0", cuentabancaria: "757586867478932473", poliza: "asd66ddd", persona: "hola", costounitario: "200.00", rfc: "jghfgddjgdk4", direccion: "asdad5456", tipocompra: "Estatal", registrationDate: "2024-01-15" },
                { numerobien: "0", cuentabancaria: "757586867478932473", poliza: "asd66ddd", persona: "hola", costounitario: "200.00", rfc: "jghfgddjgdk4", direccion: "asdad5456", tipocompra: "Estatal", registrationDate: "2024-01-15" },
                { numerobien: "0", cuentabancaria: "757586867478932473", poliza: "asd66ddd", persona: "hola", costounitario: "200.00", rfc: "jghfgddjgdk4", direccion: "asdad5456", tipocompra: "Estatal", registrationDate: "2024-01-15" },
                { numerobien: "0", cuentabancaria: "757586867478932473", poliza: "asd66ddd", persona: "hola", costounitario: "200.00", rfc: "jghfgddjgdk4", direccion: "asdad5456", tipocompra: "Estatal", registrationDate: "2024-01-15" },
                { numerobien: "0", cuentabancaria: "757586867478932473", poliza: "asd66ddd", persona: "hola", costounitario: "200.00", rfc: "jghfgddjgdk4", direccion: "asdad5456", tipocompra: "Estatal", registrationDate: "2024-01-15" },
                { numerobien: "0", cuentabancaria: "757586867478932473", poliza: "asd66ddd", persona: "hola", costounitario: "200.00", rfc: "jghfgddjgdk4", direccion: "asdad5456", tipocompra: "Estatal", registrationDate: "2024-01-15" },
                // Agrega más usuarios aquí...
            ],
            itemsPerPage: 10, // Cantidad de elementos por página
            currentPage: 1, // Página actual
        };
    },
    computed: {
        filteredBajas() {
            const query = this.searchQuery.toLowerCase();
            return this.users.filter(user =>
                user.numerobien.toLowerCase().includes(query) ||
                user.cuentabancaria.toLowerCase().includes(query) ||
                user.poliza.toLowerCase().includes(query) ||
                user.persona.toLowerCase().includes(query) ||
                user.costounitario.toLowerCase().includes(query) ||
                user.rfc.toLowerCase().includes(query) ||
                user.direccion.toLowerCase().includes(query) ||
                user.tipocompra.toLowerCase().includes(query) ||
                user.registrationDate.toLowerCase().includes(query)
            );
        },
        paginatedBajas() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredBajas.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredBajas.length / this.itemsPerPage);
        }
    },
    methods: {
        changePage(page) {
            if (page > 0 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        showMenu(menu) {
            this.menus[menu] = true;
        },
        hideMenu(menu) {
            this.menus[menu] = false;
        },
        navigateTo(route) {
            this.$router.push({ name: route });
        },
        goBack() {
            window.history.back();
        },
        downloadPDF() {
            const doc = new jsPDF();
            doc.text("Tabla de Resguardo", 14, 10);
            doc.autoTable({
                head: [
                    [
                        "No. Bien",
                        "Cuenta Bancaria",
                        "No. Poliza",
                        "Persona",
                        "Costo Unitario",
                        "RFC",
                        "Dirección",
                        "Tipo de Compra",
                        "Fecha de compra"
                    ]
                ],
                body: this.filteredBajas.map(user => [
                    user.numerobien,
                    user.cuentabancaria,
                    user.poliza,
                    user.persona,
                    user.costounitario,
                    user.rfc,
                    user.direccion,
                    user.tipocompra,
                    user.registrationDate
                ]),
                headStyles: {
                    fillColor: "691B31" // Color rojo para la primera fila
                }
            });
            doc.save("Tabla_resguardo.pdf");
        },

        downloadExcel() {
            const ws = XLSX.utils.json_to_sheet(this.users);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Resguardo');
            XLSX.writeFile(wb, 'Tabla_resguardo.xlsx');
        }
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
    redirectToAddUser() {
        // Aquí defines la ruta a la que quieres redirigir al hacer clic en el botón
        this.$router.push('/register');
    },
    changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
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
    width: 99vw;
    height: 97.5vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(to bottom, #000000, #691B31);
    color: white;
    overflow-x: hidden;
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

.user-table {
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

.user-table th,
.user-table td {
    padding: 10px;
    text-align: center;
}

.user-table th {
    background-color: #BC955B;
    color: white;
}

.user-table tr:hover {
    background-color: #70727265;
    color: #A02142;
    transition: background-color 0.3s ease;
}

.btn-edit,
.btn-delete {
    text-align: center;
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 15px;
    padding-right: 15px;
    border: none;
    cursor: pointer;
}

.btn-edit {
    background-color: #4CAF50;
    color: white;
    margin-bottom: 4px;
}

.btn-delete {
    background-color: #f44336;
    color: white;
    padding-right: 60px;

}

.btn-edit:hover {
    background-color: #45a049;
}

.btn-delete:hover {
    background-color: #e41f1f;
}

.contenedor-tabla {
    display: flex;
    flex-direction: column;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Barra de búsqueda */
.search-bar {
    margin: 20px 0;
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

.download-buttons {
    margin: 20px 0;
    text-align: center;
}

.download-buttons button {
    width: 150px;
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #f8c102;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
}

.download-buttons button:hover {
    background-color: #e0a800;
}
</style>