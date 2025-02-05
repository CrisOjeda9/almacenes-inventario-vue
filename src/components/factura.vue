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
                <h1>Facturas</h1>
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
                    <button @click="navigateTo('home')">Alta de bienes</button>
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Mi resguardo</button>
                    <button @click="navigateTo('listaalmacen')">Lista Almacén para asignar No.Inventario</button>
                    <button @click="navigateTo('')">Lista Bienes con No.Inventario para asignar Usuario</button>
                    <button @click="navigateTo('')">Generación de Formatos/Reportes</button>
                    <button @click="navigateTo('bienesnuevos')">Bienes nuevos para asignar resguardo</button>
                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('facturaMenu')" @mouseleave="hideMenu('facturaMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.facturaMenu">
                    <button @click="navigateTo('solicitudmaterial')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('facturas')">Salida de existencias</button>
                    <button @click="navigateTo('existencia')">Entrada de existencias</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')"
                        style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Facturas</button>
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
            <button class="add-factura-btn" @click="redirectToAddfactura">
                <i class="fas fa-file-invoice"></i> <i class="fas fa-plus"></i>
            </button>
        </div>

        <div class="contenedor-tabla">
            <table class="factura-table">
                <thead>
                    <tr>
                        <th>Tipo de alta</th>
                        <th>Tipo de documento que ampara</th>
                        <th>Fecha de adquisición</th>
                        <th>No. Factura</th>
                        <th>Tipo de compra</th>
                        <th>Concepto</th>
                        <th>Fecha de Factura</th>
                        <th>Nombre Proveedor</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Precio total sin IVA</th>
                        <th>IVA</th>
                        <th>Precio total con IVA</th>
                        <th>Documento</th>
                        <th>Fecha de registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="factura in paginatedfactura" :key="factura.id">
                        <td>{{ factura.tipoAlta }}</td>
                        <td>{{ factura.tipoDocumento }}</td>
                        <td>{{ factura.fechaAdquisicion }}</td>
                        <td>{{ factura.nofactura }}</td>
                        <td>{{ factura.tipocomra }}</td>
                        <td>{{ factura.concepto }}</td>
                        <td>{{ factura.fechafactura }}</td>
                        <td>{{ factura.proveedor }}</td>
                        <td>{{ factura.cantidad }}</td>
                        <td>{{ factura.preciounitario }}</td>
                        <td>{{ factura.totalsiniva }}</td>
                        <td>{{ factura.iva }}</td>
                        <td>{{ factura.totalconiva }}</td>
                        <td>
                            <a :href="'/ruta/del/archivo/' + factura.archivodocumento" download>
                                <button class="btn-download">
                                    <i class="fas fa-download"></i>
                                </button>
                            </a>
                        </td>
                        <td>{{ factura.registrationDate }}</td>
                        <td>
                            <button @click="editfactura(factura)" class="btn-edit">Editar</button>
                            <button @click="showDeleteModal(factura.id)" class="btn-delete">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Modal de Edición -->
            <div v-if="isEditing" class="edit-modal">
                <div class="modal-content">
                    <h3>Editar Factura</h3>
                    <form @submit.prevent="saveChanges" class="edit-form">
                        <div class="contenedorformulario">
                            <!-- Primera columna del formulario -->
                            <div class="form-column">
                                <div>
                                    <label>Tipo de alta:</label>
                                    <input v-model="currentFactura.tipoAlta" type="text" />
                                </div>
                                <div>
                                    <label>Tipo de documento que ampara:</label>
                                    <input v-model="currentFactura.tipoDocumento" type="text" />
                                </div>
                                <div>
                                    <label>Factura No.:</label>
                                    <input v-model="currentFactura.nofactura" type="text" />
                                </div>
                                <div>
                                    <label>Tipo de compra:</label>
                                    <input v-model="currentFactura.tipocomra" type="text" />
                                </div>
                                <div>
                                    <label>Concepto:</label>
                                    <input v-model="currentFactura.concepto" type="text" />
                                </div>
                                <div style="width: 100%;">
                                    <label>Proveedor: (Selecciona uno)</label>
                                    <select v-model="currentFactura.proveedor" style="height: 35px; width: 320px;" class="form-input">
                                        <option value="" disabled selected>Selecciona un proveedor</option>
                                        <option value="Proveedor 1">Proveedor 1</option>
                                        <option value="Proveedor 2">Proveedor 2</option>
                                        <option value="Proveedor 3">Proveedor 3</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Cantidad:</label>
                                    <input v-model="currentFactura.cantidad" type="text" />
                                </div>
                            </div>

                            <!-- Segunda columna del formulario -->
                            <div class="form-column">

                               
                                <div>
                                    <label>Precio unitario:</label>
                                    <input v-model="currentFactura.preciounitario" type="text" />
                                </div>
                                <div>
                                    <label>Total sin IVA:</label>
                                    <input v-model="currentFactura.totalsiniva" type="text" />
                                </div>
                                <div>
                                    <label>IVA:</label>
                                    <input v-model="currentFactura.iva" type="text" />
                                </div>
                                <div>
                                    <label>Total con IVA:</label>
                                    <input v-model="currentFactura.totalconiva" type="text" />
                                </div>
                                <div class="contenedor-dropzone">
                                    <label for="archivodocumento">Documento (PDF, JPG, PNG)</label>
                                    <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent
                                        @click="triggerFileInput">
                                        <!-- Campo de subida de archivo -->
                                        <input type="file" id="archivodocumento" ref="fileInput"
                                            @change="handleFileChange" accept=".pdf,.jpg,.png" style="display: none;" />

                                        <!-- Ícono y mensaje -->
                                        <i class="fas fa-cloud-upload-alt"></i>
                                        <span v-if="!currentFactura.archivodocumento">
                                            Arrastra aquí o haz clic para subir un archivo
                                        </span>
                                        <span v-else>
                                            Archivo seleccionado: {{ currentFactura.archivodocumento.name }}
                                        </span>
                                    </div>
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


            <!-- Modal de Confirmación de Eliminación -->
            <div v-if="isDeleteModalVisible" class="modal-overlay">
                <div class="modal-content-delete">
                    <h3>¿Estás seguro de eliminar esta factura?</h3>
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
    name: "facturaPage",
    data() {
        return {

            isDeleteModalVisible: false,
            menus: {
                homeMenu: false,
                facturaMenu: false,
                settingsMenu: false,
            },
            searchQuery: '',
            currentPage: 1,
            facturaPerPage: 10,
            isEditing: false, // Para controlar si estamos en modo de edición
            currentFactura: {
                proveedor: "", // Debe estar vacío para que se seleccione la opción "Selecciona"

            }, // Objeto para almacenar la póliza que se está editando
            factura: [
                {
                    id: 1,
                    tipoAlta: "Alta",
                    tipoDocumento: "Factura de compra",
                    fechaAdquisicion: "2024-01-05",
                    nofactura: "121212",
                    tipocomra: "Seguro contra incendios",
                    concepto: "Edificio principal",
                    fechafactura: "2024-01-01",
                    proveedor: "Anual",
                    cantidad: "Premium",
                    preciounitario: "$5,000",
                    totalsiniva: "$1,000,000",
                    iva: "30 días",
                    totalconiva: "Daños preexistentes",
                    archivodocumento: "asdadasda",
                    registrationDate: "2024-01-15"
                }

            ]
        };
    },
    computed: {
        filteredfactura() {
            const query = this.searchQuery.toLowerCase();
            return this.factura.filter(factura => {
                return factura.tipoAlta.toString().toLowerCase().includes(query) ||
                    factura.tipoDocumento.toLowerCase().includes(query) ||
                    factura.nofactura.toLowerCase().includes(query) ||
                    factura.tipocomra.toLowerCase().includes(query) ||
                    factura.concepto.toLowerCase().includes(query) ||
                    factura.fechafactura.toLowerCase().includes(query) ||
                    factura.proveedor.toLowerCase().includes(query) ||
                    factura.cantidad.toLowerCase().includes(query) ||
                    factura.preciounitario.toLowerCase().includes(query) ||
                    factura.totalsiniva.toLowerCase().includes(query) ||
                    factura.iva.toLowerCase().includes(query) ||
                    factura.totalconiva.toLowerCase().includes(query);
            });
        },


        totalPages() {
            return Math.ceil(this.filteredfactura.length / this.facturaPerPage);
        },
        paginatedfactura() {
            const start = (this.currentPage - 1) * this.facturaPerPage;
            const end = start + this.facturaPerPage;
            return this.filteredfactura.slice(start, end);
        }
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click(); // Abre el explorador de archivos al hacer clic
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.currentFactura.archivodocumento = file; // Guarda el archivo en el estado actual
            }
        },
        handleDrop(event) {
            const file = event.dataTransfer.files[0];
            if (file) {
                this.currentFactura.archivodocumento = file; // Guarda el archivo arrastrado en el estado actual
            }
        },
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
        editfactura(factura) {
            this.currentFactura = { ...factura };
            this.isEditing = true;
        },
        saveChanges() {
            const index = this.factura.findIndex(factura => factura.id === this.currentFactura.id);
            if (index !== -1) {
                this.factura[index] = { ...this.currentFactura };
                this.isEditing = false;
                this.currentFactura = {}; // Limpiar el objeto
            }
        },
        cancelEdit() {
            this.isEditing = false;
            this.currentFactura = {}; // Limpiar el objeto
        },

        showDeleteModal(id) {
            this.deleteId = id;
            this.isDeleteModalVisible = true;
        },
        confirmDelete() {
            const index = this.factura.findIndex(factura => factura.id === this.deleteId);
            if (index !== -1) {
                this.factura.splice(index, 1);
            }
            this.isDeleteModalVisible = false;
            this.deleteId = null;
        },
        cancelDelete() {
            this.isDeleteModalVisible = false;
            this.deleteId = null;
        },
        redirectToAddfactura() {
            // Aquí defines la ruta a la que quieres redirigir al hacer clic en el botón
            this.$router.push('/newfactura');
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
/* Contenedor responsivo */
.contenedor-tabla {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow-x: auto; /* Habilita desplazamiento horizontal */
}

/* Tabla principal */
.factura-table {
    width: 100%; /* Ocupa todo el ancho disponible */
    max-width: 1200px; /* Limita el ancho máximo */
    border-collapse: separate;
    border-spacing: 0;
    background-color: white;
    color: #691B31;
    font-size: 15px;
    border-radius: 15px;
    overflow: hidden;
    table-layout: auto; /* Ajusta el ancho según el contenido */
}

.factura-table th,
.factura-table td {
    padding: 10px;
    text-align: center;
    word-wrap: break-word; /* Permite el ajuste de palabras largas */
}

.factura-table th {
    background-color: #BC955B;
    color: white;
}

.factura-table tr:hover {
    background-color: #70727265;
    color: #A02142;
    transition: background-color 0.3s ease;
}

/* Botones */
.btn-edit,
.btn-delete {
    text-align: center;
    padding: 5px 15px;
    border: none;
    cursor: pointer;
    width: 100%; /* Botones se ajustan al ancho */
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

/* Media queries para pantallas más pequeñas */
@media (max-width: 1400px) {
    .factura-table {
        font-size: 14px;
    }

    .factura-table th,
    .factura-table td {
        padding: 8px;
    }

    .btn-edit,
    .btn-delete {
        padding: 5px;
    }
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



.add-factura-btn {
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

.add-factura-btn:hover {
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
    font-size: 20px;
    background: #691B31;
    padding: 10px;
    border-radius: 25px;
    width: 80%;
    height: 600px;
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
    width: 85%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 25px;
    box-sizing: border-box;
    background-color: #dcdcdc;
}



/* Estilos del Dropzone */
.dropzone {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px dashed #98989A;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s ease;
    min-width: 300px;
    /* Ocupa todo el ancho disponible */
    max-width: 300px;
    /* Ocupa todo el ancho disponible */
    min-height: 100px;
    /* Mantiene una altura mínima */
    max-height: 100px;
    /* Mantiene una altura mínima */
    box-sizing: border-box;
    /* El padding no afectará el tamaño */
    overflow: hidden;
    /* Evita que el contenido sobrepase los límites del contenedor */
    word-wrap: break-word;
    /* Asegura que el texto largo se ajuste al contenedor */
}

.dropzone:hover {
    background-color: #ecf6fc;
}

.dropzone i {
    font-size: 30px;
    color: #6F7271;
}

.dropzone span {
    font-size: 12px;
    color: #6F7271;
    overflow: hidden;
    /* Evita que el texto de la etiqueta ocupe más espacio del necesario */
    text-overflow: ellipsis;
    /* Muestra "..." si el texto es demasiado largo */
    white-space: nowrap;
    /* Evita que el texto se divida en varias líneas */
}

.dropzone input[type="file"] {
    display: none;
}

/* Contenedor padre para centrar el Dropzone */
.contenedor-dropzone {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    /* Ajusta según tus necesidades */
}

.contenedor-dropzone label {
    color: white;
}
</style>