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
                <h1>Proveedores</h1>
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
                    <button @click="navigateTo('historialbienes')">Historial de bienes</button>
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Bienes sin Resguardo</button>
                    <button @click="navigateTo('listaalmacen')">Asignar No.Inventario</button>
                    <button @click="navigateTo('reportes')">Generación de Reportes</button>
                    <button @click="navigateTo('bienesnuevos')">Asignar resguardo</button>
                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('proveedorMenu')" @mouseleave="hideMenu('proveedorMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.proveedorMenu">
                    <button @click="navigateTo('solicitudmaterial')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('existencia')">Entrada de existencias</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')"
                        style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Ver proveedores</button>
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

            <!-- Botón para agregar nuevo usuario -->
            <button class="add-proveedor-btn" @click="redirectToAddproveedor">
                <i class="fas fa-user"></i> <i class="fas fa-plus"></i>
            </button>
        </div>

        <div class="contenedor-tabla">
            <table class="proveedor-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Tipo de Proveedor</th>
                        <th>RFC</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Correo Electronico</th>
                        <th>Cuenta Bancaria</th>
                        <th>Documento</th>
                        <th>Fecha de registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="proveedor in paginatedproveedor" :key="proveedor.id">
                        <td>{{ proveedor.nombre }}</td>
                        <td>{{ proveedor.apellidos }}</td>
                        <td>{{ proveedor.tipoProveedor }}</td>
                        <td>{{ proveedor.rfc }}</td>
                        <td>{{ proveedor.direccion }}</td>
                        <td>{{ proveedor.telefono }}</td>
                        <td>{{ proveedor.correo }}</td>
                        <td>{{ proveedor.cuentaBancaria }}</td>
                        <td>
                            <!-- Botón de descarga por cada documento -->
                            <a :href="'/ruta/del/archivo/' + proveedor.documento" download>
                                <button class="btn-download">
                                    <i class="fas fa-download"></i>
                                </button>
                            </a>
                        </td>
                        <td>{{ proveedor.fechaRegistro }}</td>
                        <td>
                            <button @click="editproveedor(proveedor)" class="btn-edit">Editar</button>
                            <button @click="showDeleteModal(proveedor.id)" class="btn-delete">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Modal de Edición -->
            <!-- Modal de Edición de Proveedor -->
            <div v-if="isEditing" class="edit-modal">
                <div class="modal-content">
                    <h3>Editar Proveedor</h3>
                    <form @submit.prevent="saveChanges" class="edit-form">
                        <div class="contenedorformulario">
                            <div class="form-column">
                                <div>
                                    <label>Nombre:</label>
                                    <input v-model="currentProveedor.nombre" type="text" />
                                </div>
                                <div>
                                    <label>Apellidos:</label>
                                    <input v-model="currentProveedor.apellidos" type="text" />
                                </div>
                                <div style="width: 85%; margin-left: 0px;">
                                    <label>Tipo de Proveedor:</label>
                                    <select v-model="currentProveedor.tipoProveedor" class="form-input">
                                        <option value="" disabled>Selecciona el tipo de proveedor</option>
                                        <option value="fisico">Físico</option>
                                        <option value="moral">Moral</option>
                                    </select>
                                </div>
                                <div>
                                    <label>RFC:</label>
                                    <input v-model="currentProveedor.rfc" type="text" />
                                </div>

                            </div>

                            <div class="form-column">
                                <div>
                                    <label>Dirección:</label>
                                    <input v-model="currentProveedor.direccion" type="text" />
                                </div>
                                <div>
                                    <label>Teléfono:</label>
                                    <input v-model="currentProveedor.telefono" type="text" />
                                </div>
                                <div>
                                    <label>Correo Electrónico:</label>
                                    <input v-model="currentProveedor.correo" type="email" class='email' />
                                </div>
                                <div>
                                    <label>Cuenta Bancaria:</label>
                                    <input v-model="currentProveedor.cuentaBancaria" type="text" />
                                </div>

                            </div>
                        </div>

                        <!-- Botones debajo del formulario -->
                        <div class="form-buttons">
                            <button type="submit" class="save-btn">Guardar cambios</button>
                            <button @click="cancelEdit" type="button" class="cancel-btn">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>

            <div v-if="isDeleteModalVisible" class="modal-overlay">
                <div class="modal-content-delete">
                    <h3>¿Estás seguro de eliminar este proveedor?</h3>
                    <div class="modal-buttons">
                        <button @click="confirmDelete" class="btn-confirm">Confirmar</button>
                        <button @click="cancelDelete" class="btn-cancel">Cancelar</button>
                    </div>
                </div>
            </div>

            <!-- Paginación -->
            <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
                <span>Pagina {{ currentPage }} de {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "proveedorPage",
    data() {
        return {
            isDeleteModalVisible: false,
            menus: {
                homeMenu: false,
                proveedorMenu: false,
                settingsMenu: false,
            },
            searchQuery: '',
            currentPage: 1,
            proveedorPerPage: 10,
            isEditing: false, // Controla si estamos en modo de edición
            currentProveedor: {
                nombre: "",
                apellidos: "",
                tipoProveedor: "", // Físico o Moral
                rfc: "",
                direccion: "",
                telefono: "",
                correo: "",
                cuentaBancaria: "",
                fechaRegistro: "",
            }, // Objeto para almacenar el proveedor que se está editando
            proveedor: [
                {
                    id: 1,
                    nombre: "Juan",
                    apellidos: "Pérez",
                    tipoProveedor: "físico",
                    rfc: "JUPR890123ABC",
                    direccion: "Calle Principal 123, Ciudad",
                    telefono: "555-123-4567",
                    correo: "juan.perez@example.com",
                    cuentaBancaria: "1234567890",
                    documento: "asdasdad",
                    fechaRegistro: "2024-01-15",
                },
                {
                    id: 2,
                    nombre: "Jose",
                    apellidos: "Ramos",
                    tipoProveedor: "moral",
                    rfc: "XYZ123456DEF",
                    direccion: "Av. Secundaria 456, Ciudad",
                    telefono: "555-987-6543",
                    correo: "contacto@xyz.com",
                    cuentaBancaria: "0987654321",
                    documento: "asdasdad",
                    fechaRegistro: "2024-01-20",
                }
            ]
        };
    },
    computed: {
        filteredproveedor() {
            const query = this.searchQuery.toLowerCase();
            return this.proveedor.filter(proveedor => {
                return proveedor.nombre.toLowerCase().includes(query) ||
                    proveedor.apellidos.toLowerCase().includes(query) ||
                    proveedor.tipoProveedor.toLowerCase().includes(query) ||
                    proveedor.rfc.toLowerCase().includes(query) ||
                    proveedor.direccion.toLowerCase().includes(query) ||
                    proveedor.telefono.toLowerCase().includes(query) ||
                    proveedor.correo.toLowerCase().includes(query) ||
                    proveedor.cuentaBancaria.toLowerCase().includes(query);
            });
        },

        totalPages() {
            return Math.ceil(this.filteredproveedor.length / this.proveedorPerPage);
        },
        paginatedproveedor() {
            const start = (this.currentPage - 1) * this.proveedorPerPage;
            const end = start + this.proveedorPerPage;
            return this.filteredproveedor.slice(start, end);
        }
    },
    methods: {
        goHome() {
            this.$router.push('home'); // Redirige a la página principal ("/"). Cambia el path si es necesario.
        },
        showMenu(menu) {
            this.menus[menu] = true;
        },
        hideMenu(menu) {
            this.menus[menu] = false;
        },
        navigateTo(page) {
            this.$router.push({ name: page });
        },
        goBack() {
            window.history.back();
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        editproveedor(proveedor) {
            this.currentProveedor = { ...proveedor };
            this.isEditing = true;
        },
        saveChanges() {
            const index = this.proveedor.findIndex(proveedor => proveedor.id === this.currentProveedor.id);
            if (index !== -1) {
                this.proveedor[index] = { ...this.currentProveedor };
                this.isEditing = false;
                this.currentProveedor = {}; // Limpiar el objeto
            }
        },
        cancelEdit() {
            this.isEditing = false;
            this.currentProveedor = {}; // Limpiar el objeto
        },

        showDeleteModal(id) {
            this.deleteId = id;
            this.isDeleteModalVisible = true;
        },
        confirmDelete() {
            const index = this.proveedor.findIndex(proveedor => proveedor.id === this.deleteId);
            if (index !== -1) {
                this.proveedor.splice(index, 1);
            }
            this.isDeleteModalVisible = false;
            this.deleteId = null;
        },
        cancelDelete() {
            this.isDeleteModalVisible = false;
            this.deleteId = null;
        },
        redirectToAddproveedor() {
            this.$router.push('/newproveedor');
        },
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

.proveedor-table {
    width: 95%;
    border-collapse: separate;
    border-spacing: 0;
    background-color: white;
    color: #691B31;
    border-radius: 15px;
    /* Redondear las esquinas de la tabla */
    overflow: hidden;
    /* Para que los bordes no sobresalgan */
}

.proveedor-table th,
.proveedor-table td {
    padding: 10px;
    text-align: center;
}

.proveedor-table th {
    background-color: #BC955B;
    color: white;
}

.proveedor-table tr:hover {
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
    width: 100px;
}

.btn-edit {
    background-color: #4CAF50;
    color: white;
    margin-bottom: 4px;
}

.btn-delete {
    background-color: #f44336;
    color: white;

}

.btn-edit:hover {
    background-color: #45a049;
}

.btn-delete:hover {
    background-color: #e41f1f;
}

.contenedor-tabla {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
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



.add-proveedor-btn {
    margin-left: 50px;
    width: 60px;
    height: 60px;
    background-color: #bc955b;
    color: white;
    border: none;
    padding: 8px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
}

.add-proveedor-btn:hover {
    background-color: #a4733a;
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

/* Estilos generales */
.edit-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    color: white;
    text-align: center;
    font-size: 30px;
    background: #691B31;
    padding: 10px;
    border-radius: 25px;
    width: 80%;
    max-width: 800px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
}


.contenedorformulario {
    display: flex;
    justify-content: center;
    align-items: center;
}

form .form-column {
    align-items: center;
}



.form-column {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 48%;


}

.form-column input {
    background-color: #dcdcdc;
    color: #691B31;
    width: 300px;
}

.form-column label {
    color: white;
}

input[type="text"],
input[type="date"] {
    padding: 8px;
    border-radius: 25px;
    border: 1px solid #ccc;
}



button[type="submit"] {
    background-color: #4CAF50;
}

button[type="button"] {
    background-color: #f44336;
}

.form-buttons button:hover {
    background-color: #45a049;
}

button[type="button"]:hover {
    background-color: #d32f2f;
}

.form-buttons {
    margin-top: 30px;
    margin-bottom: 10px;
    display: flex;
    height: 50px;
    width: 100%;
    justify-content: center;
    gap: 20px;

}

.form-buttons button {
    width: 30%;
}

/* Estilos del modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal-content-delete {
    font-size: 25px;
    background: #691B31;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    text-align: center;
    padding-bottom: 40px;
}

.modal-buttons {
    margin-top: 20px;
}

.btn-confirm,
.btn-cancel {
    padding: 10px;
    margin: 5px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn-confirm {
    background-color: green;
    color: white;
}

.btn-cancel {
    background-color: red;
    color: white;
}


.form-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 25px;
    box-sizing: border-box;
    background-color: #dcdcdc;
}

.form-input select {

    width: 100%;
    height: 35px;
    border-radius: 25px;
    background-color: #dcdcdc;
}

.email {
    width: 90%;
    height: 35px;
    border-radius: 25px;
    background-color: #dcdcdc;

}
</style>