<template>
    <div class="page-wrapper">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        <NavBarPage :pageTitle="'Gestión de Usuarios'" :showUserMenu="true" />
        <div class="container">
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
                <div class="table-horizontal-scroll"> <!-- Nuevo wrapper para scroll -->
                    <table class="user-table">
                        <thead>
                            <tr>
                                <th>Rol</th>
                                <th>Nombre(s)</th>
                                <th>Apellidos</th>
                                <th>RFC</th>
                                <th>CURP</th>
                                <th>Nivel</th>
                                <th>Num. trabajador</th>
                                <th>Direc. pertenencia</th>
                                <th>Departamento</th>
                                <th>Cargo</th>
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
                                <td>{{ user.nivel }}</td>
                                <td>{{ user.numero_trabajador }}</td>
                                <td> {{ getDireccionText(user.direccion_pertenencia) }}</td>
                                <td>{{ user.departamento }}</td>
                                <td>{{ user.cargo }}</td>
                                <td>{{ user.email }}</td>
                                <td>

                                    <!-- Enlace para abrir la foto en una nueva pestaña -->
                                    <a v-if="user.imagen" :href="getImageUrl(user.imagen)" target="_blank" class="btn-open">
                                        <img v-if="user.imagen" :src="getImageUrl(user.imagen)"
                                            style="width: 40px; height: 40px;" alt="Foto de perfil" class="user-photo" />
                                    </a>
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
                                    <button @click="downloadZip(user)" class="btn-download">
                                        <p class="textoDescarga">Descargar</p>
                                    </button>
                                </td>
                                <td>{{ formatDate(user.createdAt) }}</td>

                                <td>
                                    <button @click="showDeleteModal(user.id)" class="btn-delete">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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

            </div>
            <!-- Paginación -->
            <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
                <span>Pagina <br> {{ currentPage }} de {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
            </div>
        </div>
    </div>    
</template>

<script>
import axios from "axios";
//import JSZip from 'jszip';
// import { saveAs } from 'file-saver';
import NavBarPage from './NavBar.vue';

export default {
    name: "userPage",
    components: {
        NavBarPage // Registrar el componente
    },
    data() {
        return {
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario
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
                almacenMenu: false,
            },
            searchQuery: '',
            currentPage: 1,
            userPerPage: 10,
            user: [], // Vacío al principio, se llenará con los datos de la API
        };
    },
    computed: {
        filtereduser() {
            const query = this.searchQuery.toLowerCase();
            return this.user.filter(user => {
                return (
                    (user.nombre && user.nombre.toString().toLowerCase().includes(query)) ||
                    (user.rol && user.rol.toString().toLowerCase().includes(query)) ||
                    (user.apellidos && user.apellidos.toString().toLowerCase().includes(query)) ||
                    (user.CURP && user.CURP.toString().toLowerCase().includes(query)) ||
                    (user.numero_trabajador && user.numero_trabajador.toString().toLowerCase().includes(query)) ||
                    (user.direccion_pertenencia && user.direccion_pertenencia.toString().toLowerCase().includes(query)) ||
                    (user.departamento && user.departamento.toString().toLowerCase().includes(query)) ||
                    (user.RFC && user.RFC.toString().toLowerCase().includes(query))
                );
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
        this.loadUserData();
    },
    methods: {
        navigateTo(page) {
            this.$router.push({ name: page });
        },

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
                    downloadUrl: `http://localhost:3000/api/users-files/${nameWithoutExtension}`, // URL sin extensión para descarga
                    name: nameWithoutExtension // Nombre sin extensión
                };
            });
        },

        async downloadZip(user) {
            try {
                // Obtener los archivos PDF
                const pdfFiles = this.getPdfFiles(user.identificacion);

                // Verificar si hay archivos para descargar
                if (pdfFiles.length === 0) {
                    alert("No hay archivos para descargar.");
                    return;
                }

                // Descargar cada archivo PDF individualmente
                for (const file of pdfFiles) {
                    // Hacer una solicitud a la API para obtener el archivo
                    const response = await fetch(file.downloadUrl); // Usar la URL de descarga sin extensión

                    // Verificar si la respuesta es exitosa
                    if (!response.ok) {
                        throw new Error(`Error al obtener el archivo: ${response.statusText}`);
                    }

                    // Convertir la respuesta a un Blob
                    const blob = await response.blob();

                    // Crear un enlace para descargar el archivo
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob); // Crear una URL temporal para el Blob
                    link.download = file.name + '.pdf'; // Nombre del archivo con extensión
                    document.body.appendChild(link);
                    link.click(); // Simular clic para iniciar la descarga
                    document.body.removeChild(link); // Eliminar el enlace del DOM
                    URL.revokeObjectURL(link.href); // Liberar la URL temporal
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error al descargar los archivos PDF. Por favor, inténtalo de nuevo.');
            }
        },


        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('es-MX', options); // Usando la configuración en español de México
        },
        async fetchUsers() {
            try {
                // Obtener todos los usuarios de la API
                const usersResponse = await axios.get('http://localhost:3000/api/usuarios');
                const users = usersResponse.data;

                // Obtener todos los datos de personas
                const personsResponse = await axios.get('http://localhost:3000/api/personas');
                const persons = personsResponse.data;

                // Combinar los datos de los usuarios con los datos de las personas
                this.user = users.map(user => {
                    // Encontrar la persona correspondiente a cada usuario
                    const person = persons.find(p => p.id === user.id_persona);

                    if (person) {
                        // Combinar los datos de la persona con el usuario
                        return {
                            ...user,
                            nombre: person.nombre,
                            apellidos: person.apellidos,
                            numero_trabajador: person.numero_trabajador,
                            email: person.email,
                            departamento: person.departamento,
                            identificacion: person.identificacion,
                            RFC: person.RFC,
                            CURP: person.CURP,
                            direccion_pertenencia: person.direccion_pertenencia,
                            organo_superior: person.organo_superior,
                            area_presupuestal: person.area_presupuestal,
                            cargo: person.cargo,
                            nivel: person.nivel,
                            fecha_registro: person.fecha_registro,
                            imagen: person.imagen, // Imagen de la persona
                        };
                    } else {
                        // Si no se encuentra la persona, solo devolver los datos del usuario
                        return user;
                    }
                });
            } catch (error) {
                console.error("Hubo un error al obtener los usuarios y las personas:", error);
            }
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
    list-style-type: none;
    /* Quita los puntos de la lista */
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

.textoDescarga {
    font-size: 14px;

}


.page-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
    top: 0;
    left: 0;
    overflow-x: hidden;
    overflow-y: auto;
    position: fixed;
    
}

.container {
    flex: 1;
    width: 100%;
    padding: 20px;
    background-color: #f5f5f5;
    min-height: calc(100vh - 140px);

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

.contenedor-tabla {
    width: 95%;
    margin-left: 2.5%;
    margin-right: 2.5%;
    display: flex;
    flex-direction: column;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
}

.table-horizontal-scroll {
    overflow-x: auto;
    /* Solo scroll horizontal */
    overflow-y: visible;
    /* Sin scroll vertical */
    border-radius: 15px;
}

.user-table {
    width: auto;
    /* Se expande según contenido */
    min-width: 100%;
    /* Mínimo el ancho del contenedor */
    border-collapse: separate;
    border-spacing: 0;
    background-color: white;
    color: #691B31;
    font-size: 14px;
}

/* Bordes redondeados solo en la tabla */
.user-table thead tr:first-child th:first-child {
    border-top-left-radius: 15px;
}

.user-table thead tr:first-child th:last-child {
    border-top-right-radius: 15px;
}

.user-table tbody tr:last-child td:first-child {
    border-bottom-left-radius: 15px;
}

.user-table tbody tr:last-child td:last-child {
    border-bottom-right-radius: 15px;
}

/* Estilos de celdas */
.user-table th,
.user-table td {
    padding: 10px;
    text-align: center;
    white-space: nowrap;
}

.user-table th {
    background-color: #BC955B;
    color: white;
    position: sticky;
    top: 0;
}

.user-table tr:hover {
    background-color: #f5f5f5;
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



.pagination {
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
}

.pagination button {
    width: 130px;
    height: 50px;
    padding: 5px;

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