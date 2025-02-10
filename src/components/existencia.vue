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
                <h1>Existencias</h1>
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
                    <button @click="navigateTo('resguardo')">Bienes sin resguardo</button>
                    <button @click="navigateTo('listaalmacen')">Asignar No.Inventario</button>
                    <button @click="navigateTo('reportes')">Generación de reportes</button>
                    <button @click="navigateTo('bienesnuevos')">Asignar resguardo</button>

                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('existenciaMenu')" @mouseleave="hideMenu('existenciaMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.existenciaMenu">
                    <button @click="navigateTo('solicitudmaterial')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('existencia')"
                        style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Entrada de
                        existencias</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
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

            <!-- Botón para agregar nuevo usuario -->
            <button class="add-existencia-btn" @click="redirectToAddExistencia">
                <i class="fas fa-file-invoice"></i> <i class="fas fa-plus"></i>
            </button>
        </div>

        <div class="contenedor-tabla">
            <table class="existencia-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Número de factura</th>
                        <th>Número de partida</th>
                        <th>Nombre</th>
                        <th>Importe sin IVA</th>
                        <th>IVA</th>
                        <th>Importe con IVA</th>
                        <th>Cantidad</th>
                        <th>Unidad de medida</th>
                        <th>Ubicación en almacén</th>
                        <th>Total de ingreso</th>
                        <th>Foto artículo</th>
                        <th>Fecha de registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="existencia in paginatedExistencias" :key="existencia.id">
                        <td>{{ existencia.id }}</td>
                        <td>{{ existencia.numeroFactura }}</td>
                        <td>{{ existencia.numeroPartida }}</td>
                        <td>{{ existencia.nombre }}</td>
                        <td>{{ existencia.importeSinIVA }}</td>
                        <td>{{ existencia.iva }}</td>
                        <td>{{ existencia.importeConIVA }}</td>
                        <td>{{ existencia.cantidad }}</td>
                        <td>{{ existencia.unidadMedida }}</td>
                        <td>{{ existencia.ubicacionAlmacen }}</td>
                        <td>{{ existencia.totalIngreso }}</td>
                        <td>
                            <a :href="'/ruta/del/archivo/' + existencia.fotoArticulo" download>
                                <button class="btn-download">
                                    <i class="fas fa-download"></i>
                                </button>
                            </a>
                        </td>
                        <td>{{ existencia.fechaRegistro }}</td>
                        <td>
                            <button @click="editExistencia(existencia)" class="btn-edit">Editar</button>
                            <button @click="showDeleteModal(existencia.id)" class="btn-delete">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>


            <!-- Modal de Edición -->
            <div v-if="isEditing" class="edit-modal">
                <div class="modal-content">
                    <h3>Editar Existencia</h3>
                    <form @submit.prevent="saveChanges" class="edit-form">
                        <div class="contenedorformulario">
                            <!-- Primera columna -->
                            <div class="form-column">
                                <div>
                                    <label>ID:</label>
                                    <input v-model="currentExistencia.id" type="text" disabled />
                                </div>
                                <div>
                                    <label>Número de factura:</label>
                                    <input v-model="currentExistencia.numeroFactura" type="text" />
                                </div>

                                <div>
                                    <label>Número de partida:</label>
                                    <input v-model="currentExistencia.numeroPartida" type="text" />
                                </div>
                                <div>
                                    <label>Nombre:</label>
                                    <input v-model="currentExistencia.nombre" type="text" />
                                </div>

                            </div>

                            <!-- Segunda columna -->
                            <div class="form-column">

                                <div>
                                    <label>Importe sin IVA:</label>
                                    <input v-model="currentExistencia.importeSinIVA" type="text" />
                                </div>
                                <div>
                                    <label>IVA:</label>
                                    <input v-model="currentExistencia.iva" type="text" />
                                </div>
                                <div>
                                    <label>Importe con IVA:</label>
                                    <input v-model="currentExistencia.importeConIVA" type="text" />
                                </div>
                                <label for="fotoArticulo">Foto artículo</label>
                                <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent
                                    @click="triggerFileInput">

                                    <input type="file" id="updateFotoArticulo" ref="fileInput"
                                        @change="handleFileChange" accept=".pdf,.jpg,.png" style="display: none;" />

                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <span v-if="!currentExistencia.fotoArticulo">
                                        Arrastra o selecciona un archivo (PDF, JPG, PNG)
                                    </span>
                                    <span v-else>
                                        {{ currentExistencia.fotoArticulo.name }}
                                    </span>
                                </div>

                            </div>

                            <!-- Tercera columna -->
                            <div class="form-column">
                                <div>
                                    <label>Cantidad:</label>
                                    <input v-model="currentExistencia.cantidad" type="text" />
                                </div>
                                <div>
                                    <label>Unidad de medida:</label>
                                    <select v-model="currentExistencia.unidadMedida" class="form-input">
                                        <option value="" disabled>Selecciona una opción</option>
                                        <option value="piezas">Piezas</option>
                                        <option value="paquetes">Paquetes</option>
                                        <option value="cajas">Cajas</option>
                                        <option value="kilogramos">Kilogramos</option>
                                        <option value="litros">Litros</option>
                                        <option value="metros">Metros</option>
                                        <option value="rollos">Rollos</option>
                                        <option value="bultos">Bultos</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Ubicación en almacén:</label>
                                    <input v-model="currentExistencia.ubicacionAlmacen" type="text" />
                                </div>
                                <div>
                                    <label>Total de ingreso:</label>
                                    <input v-model="currentExistencia.totalIngreso" type="text" />
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
                    <h3>¿Estás seguro de eliminar esta existencia?</h3>
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
    name: "existenciaPage",
    data() {
        return {
            isDeleteModalVisible: false,
            menus: {
                homeMenu: false,
                existenciaMenu: false,
                settingsMenu: false,
            },
            searchQuery: '',
            currentPage: 1,
            existenciasPerPage: 10,
            isEditing: false, // Para controlar si estamos en modo de edición
            currentExistencia: {}, // Objeto para almacenar la existencia que se está editando
            existencias: [
                {
                    id: 1,
                    numeroFactura: "FAC-202301",
                    numeroPartida: "12345",
                    nombre: "Producto A",
                    importeSinIVA: "$10,000",
                    iva: "$1,600",
                    importeConIVA: "$11,600",
                    cantidad: "100",
                    unidadMedida: "Piezas",
                    ubicacionAlmacen: "Almacén 1 - Estante 3",
                    totalIngreso: "100",
                    fotoArticulo: "imagen_a.jpg",
                    fechaRegistro: "2024-01-01"
                },
                {
                    id: 2,
                    numeroFactura: "FAC-202302",
                    numeroPartida: "67890",
                    nombre: "Producto B",
                    importeSinIVA: "$5,000",
                    iva: "$800",
                    importeConIVA: "$5,800",
                    cantidad: "50",
                    unidadMedida: "Cajas",
                    ubicacionAlmacen: "Almacén 2 - Estante 5",
                    totalIngreso: "50",
                    fotoArticulo: "imagen_b.jpg",
                    fechaRegistro: "2024-01-02"
                }
            ]
        };
    },
    computed: {
        filteredExistencias() {
            const query = this.searchQuery.toLowerCase();
            return this.existencias.filter(existencia => {
                return (
                    existencia.numeroFactura.toLowerCase().includes(query) ||
                    existencia.nombre.toLowerCase().includes(query) ||
                    existencia.ubicacionAlmacen.toLowerCase().includes(query)
                );
            });
        },
        totalPages() {
            return Math.ceil(this.filteredExistencias.length / this.existenciasPerPage);
        },
        paginatedExistencias() {
            const start = (this.currentPage - 1) * this.existenciasPerPage;
            const end = start + this.existenciasPerPage;
            return this.filteredExistencias.slice(start, end);
        }
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file && this.isValidFileType(file)) {
                this.currentExistencia.fotoArticulo = file;
            } else {
                alert('Solo se permiten archivos de tipo PDF, JPG o PNG.');
            }
        },
        handleDrop(event) {
            const file = event.dataTransfer.files[0];
            if (file && this.isValidFileType(file)) {
                this.currentExistencia.fotoArticulo = file;
            } else {
                alert('Solo se permiten archivos de tipo PDF, JPG o PNG.');
            }
        },
        isValidFileType(file) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
            return allowedTypes.includes(file.type);
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
        editExistencia(existencia) {
            this.currentExistencia = { ...existencia };
            this.isEditing = true;
        },
        saveChanges() {
            const index = this.existencias.findIndex(
                existencia => existencia.id === this.currentExistencia.id
            );
            if (index !== -1) {
                this.existencias[index] = { ...this.currentExistencia };
                this.isEditing = false;
                this.currentExistencia = {}; // Limpiar el objeto
            }
        },
        cancelEdit() {
            this.isEditing = false;
            this.currentExistencia = {}; // Limpiar el objeto
        },

        showDeleteModal(id) {
            this.deleteId = id;
            this.isDeleteModalVisible = true;
        },
        confirmDelete() {
            const index = this.existencias.findIndex(
                existencia => existencia.id === this.deleteId
            );
            if (index !== -1) {
                this.existencias.splice(index, 1);
            }
            this.isDeleteModalVisible = false;
            this.deleteId = null;
        },
        cancelDelete() {
            this.isDeleteModalVisible = false;
            this.deleteId = null;
        },
        redirectToAddExistencia() {
            // Aquí defines la ruta a la que quieres redirigir al hacer clic en el botón
            this.$router.push('/newexistencia');
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

.existencia-table {
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

.existencia-table th,
.existencia-table td {
    padding: 10px;
    text-align: center;
}

.existencia-table th {
    background-color: #BC955B;
    color: white;
}

.existencia-table tr:hover {
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
    max-width: 90px;
}

.btn-edit {
    background-color: #4CAF50;
    color: white;
    margin-bottom: 4px;
    width: 100%;
}

.btn-delete {
    background-color: #f44336;
    color: white;
    width: 100%;

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



.add-existencia-btn {
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

.add-existencia-btn:hover {
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
    width: 100%;
    max-width: 1050px;
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


.form-column select {
    background-color: #dcdcdc;
    color: #691B31;
    border-radius: 25px;
    width: 315px;
    height: 35px;
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

.btn-download {
    width: 80%;
}
</style>