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
                <h1>Gestión de Usuarios</h1>
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
            <a href="users" class="nav-item" style="color: #6F7271; ">Usuarios</a>
            <div class="nav-item" @mouseenter="showMenu('homeMenu')" @mouseleave="hideMenu('homeMenu')">
                Inventario
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.homeMenu">
                    <button @click="navigateTo('bajas')">Historial de bajas</button>
                    <button @click="navigateTo('home')">Alta de bienes</button>
                    <button @click="navigateTo('home')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Mi resguardo</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('poliza')">Polizas</button>
                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('userMenu')" @mouseleave="hideMenu('userMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.userMenu">
                    <button @click="navigateTo('user')">Solicitud de material</button>
                    <button @click="navigateTo('user')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('user')">Baja de bienes</button>
                    <button @click="navigateTo('user')">Entrada de existencias</button>
                    <button @click="navigateTo('user')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                </div>
            </div>
        </div>

        <div class="search-bar">
            <div class="input-wrapper">
                <input type="text" v-model="searchQuery" placeholder="Buscar..." />
                <i class="fas fa-search"></i> <!-- Icono de la lupa -->
            </div>

            <!-- Botón para agregar nuevo usuario -->
            <button class="add-user-btn" @click="redirectToAdduser">
                <i class="fas fa-user"></i> <i class="fas fa-plus"></i>
            </button>
        </div>

        <div class="contenedor-tabla">
            <table class="user-table">
                <thead>
                    <tr>
                        <th>Nombre(s)</th>
                        <th>Apellidos</th>
                        <th>RFC</th>
                        <th>CURP</th>
                        <th>Num. trabajador</th>
                        <th>Direc. pertenencia</th>
                        <th>Departamento</th>
                        <th>Fecha de registro</th>
                        <th>Acciones</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in paginateduser" :key="user.id">
                        <td>{{ user.nombre }}</td>
                        <td>{{ user.apellidos }}</td>
                        <td>{{ user.rfc }}</td>
                        <td>{{ user.curp }}</td>
                        <td>{{ user.numTrabajador }}</td>
                        <td> {{ getDireccionText(user.direccionPertenencia) }}
                        </td>
                        <td>{{ user.departamento }}</td>
                        <td>{{ user.registrationDate }}</td>
                        <td>
                            <button @click="editUser(user)" class="btn-edit">Editar</button>
                            <button @click="showDeleteModal(user.id)" class="btn-delete">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Modal de Edición -->
            <div v-if="isEditing" class="edit-modal">
                <div class="modal-content">
                    <h3>Editar Usuario</h3>
                    <form @submit.prevent="saveChanges" class="edit-form">
                        <div class="contenedorformulario">
                            <div class="form-column">
                                <div>
                                    <label>Nombre(s):</label>
                                    <input v-model="currentUser.nombre" type="text" />
                                </div>
                                <div>
                                    <label>Apellidos:</label>
                                    <input v-model="currentUser.apellidos" type="text" />
                                </div>
                                <div>
                                    <label>RFC:</label>
                                    <input v-model="currentUser.rfc" type="text" />
                                </div>
                                <div>
                                    <label>CURP:</label>
                                    <input v-model="currentUser.curp" type="text" />
                                </div>
                               
                            </div>

                            <div class="form-column">
                                <div>
                                    <label>Número de trabajador:</label>
                                    <input v-model="currentUser.numTrabajador" type="text" />
                                </div>
                                <div>
                                    <label>Dirección de pertenencia:</label>
                                    <select v-model="currentUser.direccionPertenencia" required>
                                        <option value="">Selecciona una opción</option>
                                        <option v-for="direccion in direcciones" :value="direccion.value"
                                            :key="direccion.value">
                                            {{ direccion.text }}
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label>Departamento:</label>
                                    <input v-model="currentUser.departamento" type="text" />
                                </div>
                                <div>
                                    <label>Fecha de registro:</label>
                                    <input v-model="currentUser.registrationDate" type="date" />
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
                    <h3>¿Estás seguro de eliminar esta póliza?</h3>
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
    name: "userPage",
    data() {
        return {
            direcciones: [
                { value: 'direccion_general', text: 'Dirección General' },
                { value: 'direccion_coordinacion_financiera', text: 'Dirección de coordinación financiera y planeación' },
                { value: 'direccion_television', text: 'Dirección de televisión' },
                { value: 'direccion_noticias', text: 'Dirección de noticias' },
                { value: 'direccion_radio', text: 'Dirección de radio' },
                { value: 'direccion_ingenieria', text: 'Dirección de ingeniería' },
                { value: 'direccion_proyectos_estrategicos', text: 'Dirección de proyectos estratégicos' },
                { value: 'organo_interno_control', text: 'Órgano interno de control' },
                { value: 'direccion_promocion_intercambio', text: 'Dirección de promoción e intercambio' },
                { value: 'direccion_juridica', text: 'Dirección jurídica' },
                { value: 'direccion_vinculacion', text: 'Dirección de vinculación' },
                { value: 'estaciones_radio', text: 'Estaciones de radio' }
            ],
            isDeleteModalVisible: false,
            menus: {
                homeMenu: false,
                userMenu: false,
                settingsMenu: false,
            },
            searchQuery: '',
            currentPage: 1,
            userPerPage: 10,
            isEditing: false, // Para controlar si estamos en modo de edición
            user: [
                {
                    id: 1,
                    nombre: "Cristian",
                    apellidos: "Ojeda Gayosso",
                    rfc: "asdadadasda",
                    curp: "sadhkasldlafsasf",
                    numTrabajador: "10",
                    direccionPertenencia: "Area ",
                    departamento: "asdasdadsd",
                    registrationDate: "2024-01-15"
                },
                {
                    id: 2,
                    nombre: "Mariana",
                    apellidos: "Torres López",
                    rfc: "MKJ9237JNK",
                    curp: "TOLM920413HJCLPS05",
                    numTrabajador: "11",
                    direccionPertenencia: "Recursos Humanos",
                    departamento: "Administración",
                    registrationDate: "2024-01-16"
                },
                {
                    id: 3,
                    nombre: "Juan",
                    apellidos: "Pérez Sánchez",
                    rfc: "PZSJ800912KJH",
                    curp: "PEJS800912HDFRZN03",
                    numTrabajador: "12",
                    direccionPertenencia: "Logística",
                    departamento: "Operaciones",
                    registrationDate: "2024-01-17"
                },
                {
                    id: 4,
                    nombre: "Laura",
                    apellidos: "García Martínez",
                    rfc: "LGM123456NQR",
                    curp: "GMLA870609MDFLRR01",
                    numTrabajador: "13",
                    direccionPertenencia: "Finanzas",
                    departamento: "Contabilidad",
                    registrationDate: "2024-01-18"
                },
                {
                    id: 5,
                    nombre: "Eduardo",
                    apellidos: "Hernández Romero",
                    rfc: "EHRO456789OPQ",
                    curp: "HREL891201HDFRMD03",
                    numTrabajador: "14",
                    direccionPertenencia: "Ingeniería",
                    departamento: "Proyectos",
                    registrationDate: "2024-01-19"
                },
                {
                    id: 6,
                    nombre: "Sofía",
                    apellidos: "Ramírez Gómez",
                    rfc: "SRGM567890DFL",
                    curp: "RGSF900502MDFRMF02",
                    numTrabajador: "15",
                    direccionPertenencia: "Marketing",
                    departamento: "Publicidad",
                    registrationDate: "2024-01-20"
                }


            ]

        };
    },
    computed: {
        filtereduser() {
            const query = this.searchQuery.toLowerCase();
            return this.user.filter(user => {
                return user.nombre.toString().toLowerCase().includes(query) ||
                    user.apellidos.toString().toLowerCase().includes(query) ||
                    user.rfc.toString().toLowerCase().includes(query) ||
                    user.curp.toString().toLowerCase().includes(query) ||
                    user.numTrabajador.toString().toLowerCase().includes(query) ||
                    user.direccionPertenencia.toString().toLowerCase().includes(query) ||
                    user.departamento.toLowerCase().includes(query);
            });
        },


        totalPages() {
            return Math.ceil(this.filtereduser.length / this.userPerPage);
        },
        paginateduser() {
            const start = (this.currentPage - 1) * this.userPerPage;
            const end = start + this.userPerPage;
            return this.filtereduser.slice(start, end);
        },
        // Función que convierte el value en su texto correspondiente
        direccionText() {
            return (value) => {
                const found = this.direcciones.find(direccion => direccion.value === value);
                return found ? found.text : value;
            };
        }
    },
    methods: {
        goHome() {
            this.$router.push('home');
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
        editUser(user) {
            this.currentUser = { ...user };  // Usar "currentUser" en lugar de "currentuser"
            this.isEditing = true;
        },
        saveChanges() {
            const index = this.user.findIndex(user => user.id === this.currentUser.id);
            if (index !== -1) {
                this.user[index] = { ...this.currentUser };
                this.isEditing = false;
                this.currentUser = {}; // Limpiar el objeto
            }
        },
        cancelEdit() {
            this.isEditing = false;
            this.currentUser = {}; // Limpiar el objeto
        },

        // Método para mostrar el modal de eliminación
        showDeleteModal(id) {
            this.deleteId = id;  // Guardamos el ID del usuario a eliminar
            this.isDeleteModalVisible = true;  // Mostramos el modal
        },

        // Método para confirmar la eliminación
        confirmDelete() {
            const index = this.user.findIndex(user => user.id === this.deleteId);
            if (index !== -1) {
                this.user.splice(index, 1); // Eliminamos el usuario de la lista
                this.isDeleteModalVisible = false;  // Cerramos el modal
                this.deleteId = null;  // Limpiamos el ID de eliminación
            }
        },

        // Método para cancelar la eliminación
        cancelDelete() {
            this.isDeleteModalVisible = false;
            this.deleteId = null; // Limpiamos el ID de eliminación
        },

        redirectToAdduser() {
            // Aquí defines la ruta a la que quieres redirigir al hacer clic en el botón
            this.$router.push('/register');
        },
        getDireccionText(direccionValue) {
            const direccion = this.direcciones.find(d => d.value === direccionValue);
            return direccion ? direccion.text : direccionValue; // Devuelve el texto si lo encuentra, o el valor si no lo encuentra
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
    padding-right: 40px;

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



.add-user-btn {
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

.add-user-btn:hover {
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

.form-column select {
    width: 90%;
    height: 35px;
    border-radius: 25px;
    background-color: #dcdcdc;


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
    width: 85%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 25px;
    box-sizing: border-box;
    background-color: #dcdcdc;
}
</style>