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
                        <p>{{ userName }}</p> <!-- Nombre dinámico del usuario -->
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
                    <button @click="navigateTo('historialbienes')">Historial de bienes</button>
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Bienes sin resguardo</button>
                    <button @click="navigateTo('listaalmacen')">Asignar No.Inventario</button>
                    <button @click="navigateTo('reportes')">Generación de reportes</button>
                    <button @click="navigateTo('bienesnuevos')">Asignar resguardo</button>
                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('userMenu')" @mouseleave="hideMenu('userMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.userMenu">
                    <button @click="navigateTo('solicitudmaterial')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('existencia')">Entrada de existencias</button>
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
            <button class="add-user-btn" @click="redirectToAdduser">
                <i class="fas fa-user"></i> <i class="fas fa-plus"></i>
            </button>
        </div>

        <div class="contenedor-tabla">
            <table class="user-table">
                <thead>
                    <tr>
                        <th>Rol</th>
                        <th>Nombre(s)</th>
                        <th>Apellidos</th>
                        <th>RFC</th>
                        <th>CURP</th>
                        <th>Num. trabajador</th>
                        <th>Direc. pertenencia</th>
                        <th>Departamento</th>
                        <th>Correo</th>
                        <th>Foto</th>
                        <th>Identificación</th>
                        <th>Fecha de registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in paginateduser" :key="user.id">
                        <td>{{ user.rol }}</td>
                        <td>{{ user.nombre }}</td>
                        <td>{{ user.apellidos }}</td>
                        <td>{{ user.RFC }}</td>
                        <td>{{ user.CURP }}</td>
                        <td>{{ user.numero_trabajador }}</td>
                        <td> {{ getDireccionText(user.direccion_pertenencia) }}</td>
                        <td>{{ user.departamento }}</td>
                        <td>{{ user.email }}</td>
                        <td>

                            <!-- Enlace para abrir la foto en una nueva pestaña -->
                            <a v-if="user.imagen" :href="getImageUrl(user.imagen)" target="_blank" class="btn-open">
                                <img v-if="user.imagen" :src="getImageUrl(user.imagen)"
                                    style="width: 40px; height: 40px;" alt="Foto de perfil" class="user-photo" /> </a>
                        </td>
                        <td>
                            <template v-if="user.identificacion">
                                 <ul>
                                    <li v-for="(file, index) in getPdfFiles(user.identificacion)" :key="index">
                                        <!-- Aplicar truncateFileName al nombre del archivo -->
                                        <a :href="file.url" target="_blank" :title="file.name">
                                            {{ truncateFileName(file.name, 20) }}
                                        </a>
                                    </li>
                                </ul>
                            </template>
                            <!-- Botón para descargar todos los archivos en un ZIP -->
                            <button @click="downloadZip(user)" class="btn-download">
                                <p class="textoDescarga">Descargar</p>
                            </button>
                        </td>



                        <td>{{ formatDate(user.createdAt) }}</td>

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
                                <div style="width: 91%;">
                                    <label for="rol">Rol de usuario</label>
                                    <select v-model="currentUser.rol" required>
                                        <option value="" disabled>Selecciona una opción</option>
                                        <option value="Administrador">Administrador</option>
                                        <option value="Inventario">Inventario</option>
                                        <option value="Almacen">Almacén</option>
                                    </select>
                                </div>
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
                                    <input v-model="currentUser.RFC" minlength="13" maxlength="13" type="text"
                                        style="text-transform: uppercase;" />
                                </div>

                            </div>

                            <div class="form-column">
                                <div>
                                    <label>CURP:</label>
                                    <input v-model="currentUser.CURP" minlength="18" maxlength="18" type="text"
                                        style="text-transform: uppercase;" />
                                </div>
                                <div>
                                    <label>Número de trabajador:</label>
                                    <input v-model="currentUser.numero_trabajador" type="text" />
                                </div>
                                <div>
                                    <label>Dirección de pertenencia:</label>
                                    <select v-model="currentUser.direccion_pertenencia" required>
                                        <option value="" disabled>Selecciona una opción</option>
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
                    <h3>¿Estás seguro de eliminar este usuario?</h3>
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
import axios from "axios";
//import JSZip from 'jszip';
// import { saveAs } from 'file-saver';


export default {
    name: "userPage",
    data() {
        return {
            userName: "Cargando...", // Mensaje temporal
            direcciones: [
                { value: 'Direccion General', text: 'Dirección General' },
                { value: 'Direccion de Coordinacion Financiera Y Planeacion', text: 'Dirección de coordinación financiera y planeación' },
                { value: 'Direccion de Television', text: 'Dirección de televisión' },
                { value: 'Direccion de Noticias', text: 'Dirección de noticias' },
                { value: 'Direccion de Radio', text: 'Dirección de radio' },
                { value: 'Direccion de Ingenieria', text: 'Dirección de ingeniería' },
                { value: 'Direccion de Proyectos Estrategicos', text: 'Dirección de proyectos estratégicos' },
                { value: 'Organo Interno de Control', text: 'Órgano interno de control' },
                { value: 'Direccion de Promocion e Intercambio', text: 'Dirección de promoción e intercambio' },
                { value: 'Direccion Juridica', text: 'Dirección jurídica' },
                { value: 'Direccion de Vinculacion', text: 'Dirección de vinculación' },
                { value: 'Estaciones de Radio', text: 'Estaciones de radio' },
                { value: 'Estaciones de Television', text: 'Estaciones de Television' }
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
            user: [], // Vacío al principio, se llenará con los datos de la API
        };
    },
    computed: {
        filtereduser() {
            const query = this.searchQuery.toLowerCase();
            return this.user.filter(user => {
                return user.nombre.toString().toLowerCase().includes(query) ||
                    user.rol.toString().toLowerCase().includes(query) ||
                    user.apellidos.toString().toLowerCase().includes(query) ||
                    user.CURP.toString().toLowerCase().includes(query) ||
                    user.numero_trabajador.toString().toLowerCase().includes(query) ||
                    user.direccion_pertenencia.toString().toLowerCase().includes(query) ||
                    user.departamento.toString().toLowerCase().includes(query) ||
                    user.RFC.toString().toLowerCase().includes(query);
            });
        },
        totalPages() {
            return Math.ceil(this.filtereduser.length / this.userPerPage);
        },
        paginateduser() {
            const startIndex = (this.currentPage - 1) * this.userPerPage;
            const endIndex = startIndex + this.userPerPage;
            return this.filtereduser.slice(startIndex, endIndex);
        }
    },
    mounted() {
        this.fetchUsers();
        this.loadUserName();
    },
    methods: {
        loadUserName() {
            const storedUserName = localStorage.getItem("userName");
            this.userName = storedUserName ? storedUserName : "Usuario desconocido";
        },
        getImageUrl(imagePath) {
            if (!imagePath) return ''; // Si no hay ruta, devolver una cadena vacía
            const baseUrl = 'http://localhost:3000/api/users-files'; // Ruta base correcta
            const filename = imagePath.split('\\').pop().split('/').pop(); // Extrae solo el nombre del archivo
            return `${baseUrl}/${filename.split('.').slice(0, -1).join('.')}`;  // Eliminar la extensión para que no aparezca .png o .jpg
        },



        truncateFileName(name, maxLength) {
            return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
        },

        // Método para obtener solo el nombre del archivo sin la extensión
        getPdfName(pdfPath) {
            const fileName = pdfPath.split('/').pop().split('\\').pop();  // Extrae solo el nombre del archivo
            return fileName.split('.')[0]; // Devuelve solo el nombre sin la extensión .pdf
        },
        getPdfFiles(pdfPaths) {
            if (!pdfPaths) return []; // Si no hay archivos, retorna un array vacío

            return pdfPaths.split(';').map((path) => {
                const fileName = path.split('/').pop().split('\\').pop(); // Extrae el nombre del archivo
                const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.'); // Quita la extensión

                return {
                    url: `http://localhost:3000/api/users-files/${nameWithoutExtension}`, // URL sin extensión para visualización
                    downloadUrl: `http://localhost:3000/api/users-files/${fileName}`, // URL con extensión para descarga
                    name: nameWithoutExtension // Nombre sin extensión
                };
            });
        },
        async downloadZip(user) {
            try {
                // Obtener los nombres de los archivos
                const pdfFiles = this.getPdfFiles(user.identificacion);

                // Extraer solo los nombres de los archivos con extensión
                const fileNames = pdfFiles.map(file => {
                    const fileNameWithExtension = file.name + '.pdf'; // Asegúrate de incluir la extensión
                    return fileNameWithExtension;
                });

                // Enviar los nombres de los archivos a la API de descarga ZIP
                const response = await fetch('http://localhost:3000/api/users/download-zip', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        files: fileNames
                    })
                });

                // Verificar si la respuesta es exitosa
                if (!response.ok) {
                    throw new Error('Error al descargar el archivo ZIP');
                }

                // Convertir la respuesta a un blob
                const blob = await response.blob();

                // Verificar si el blob es un archivo ZIP válido
                if (blob.type !== 'application/zip') {
                    throw new Error('El archivo descargado no es un ZIP válido');
                }

                // Crear un enlace para descargar el archivo ZIP
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'archivos.zip';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error al descargar el archivo ZIP. Por favor, inténtalo de nuevo.');
            }
        },


        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('es-MX', options); // Usando la configuración en español de México
        },
        fetchUsers() {
            // Hacer una solicitud GET a la API para obtener los usuarios
            axios.get('http://localhost:3000/api/usuarios') // Sustituye 'URL_DE_TU_API' con la URL real de tu API
                .then(response => {
                    // Asignar los usuarios obtenidos a la propiedad user
                    this.user = response.data; // Ajusta esta línea según la estructura de tu respuesta de API
                })
                .catch(error => {
                    console.error("Hubo un error al obtener los usuarios: ", error);
                });
        },
        showMenu(menuName) {
            this.menus[menuName] = true;
        },
        hideMenu(menuName) {
            this.menus[menuName] = false;
        },
        redirectToAdduser() {
            this.$router.push("/register");
        },
        cancelEdit() {
            this.isEditing = false;
        },
        editUser(user) {
            this.currentUser = { ...user };
            this.isEditing = true;
        },
        saveChanges() {
            // Convertir RFC y CURP a mayúsculas antes de guardar
            this.currentUser.RFC = this.currentUser.RFC.toUpperCase();
            this.currentUser.CURP = this.currentUser.CURP.toUpperCase();
            // Enviar la solicitud PUT a la API con el ID del usuario
            axios.put(`http://localhost:3000/api/usuarios/${this.currentUser.id}`, this.currentUser)
                .then(() => {
                    // Actualizar la lista de usuarios para reflejar los cambios
                    this.isEditing = false;
                    this.fetchUsers();
                    alert("Usuario actualizado exitosamente.");
                })
                .catch(error => {
                    console.error("Error al guardar los cambios: ", error);
                    alert("Hubo un error al actualizar el usuario.");
                });
        },

        showDeleteModal(userId) {
            this.selectedUserId = userId;
            this.isDeleteModalVisible = true;
        },
        confirmDelete() {
            // Enviar solicitud DELETE a la API para eliminar el usuario
            axios.delete(`http://localhost:3000/api/usuarios/${this.selectedUserId}`)
                .then(() => {
                    // Eliminar el usuario del array en frontend
                    this.user = this.user.filter(user => user.id !== this.selectedUserId);
                    this.isDeleteModalVisible = false;
                })
                .catch(error => {
                    console.error("Error al eliminar el usuario: ", error);
                    alert("Hubo un error al eliminar el usuario.");
                });
        },

        // Cancelar la eliminación (cerrar el modal)
        cancelDelete() {
            this.isDeleteModalVisible = false;
        },
        prevPage() {
            if (this.currentPage > 1) this.currentPage--;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) this.currentPage++;
        },
        getDireccionText(direccion) {
            return this.direcciones.find(item => item.value === direccion)?.text || 'No disponible';
        }
    }
};
</script>
<style scoped>
/* Aplicar Montserrat a todo el contenido */
* {
    font-family: 'Montserrat', sans-serif;
}

td ul {
    list-style-type: none; /* Quita los puntos de la lista */
    padding: 0;
    margin: 0;
}

td ul li {
    margin-bottom: 5px;
    /* Espacio entre elementos */
}

td ul li a {
    text-decoration: none;
    color: #007bff;
    font-weight: bold;
}

td ul li a:hover {
    text-decoration: underline;
}

.btn-download {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    width: 100%;
    height: 20px;
}

.btn-download:hover {
    background: #bc955b;
}
.textoDescarga{
    font-size: 14px;

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

.user-table {
    width: 110px;
    border-collapse: separate;
    border-spacing: 0;
    background-color: white;
    color: #691B31;
    border-radius: 15px;
    /* Redondear las esquinas de la tabla */
    overflow: hidden;
    /* Para que los bordes no sobresalgan */
    font-size: 13px;
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
    width: 95px;
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