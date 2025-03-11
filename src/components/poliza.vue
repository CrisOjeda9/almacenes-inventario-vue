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
                <h1>Polizas</h1>
                <p>Sistema inventario y Almacén de Radio y Televisión de Hidalgo</p>
            </div>
            <div class="navbar-right">
                <div class="user-profile">
                    <img :src="profileImage" alt="User Profile" class="profile-pic" />
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
            <a v-if="userRole === 'Administrador'" href="users" class="nav-item">Usuarios</a>
            <div v-if="userRole === 'Inventario' || userRole === 'Administrador'" class="nav-item"
                @mouseenter="showMenu('homeMenu')" @mouseleave="hideMenu('homeMenu')">
                Inventario
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.homeMenu">
                    <button @click="navigateTo('bajas')">Historial de bajas</button>
                    <button @click="navigateTo('historialbienes')">Historial de bienes</button>
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Bienes sin resguardo</button>
                    <button @click="navigateTo('listaalmacen')">Asignar No.Inventario</button>
                    <button @click="navigateTo('bienesnuevos')">Asignar resguardo</button>
                    <button @click="navigateTo('liberarbien')">Liberar Bien</button>
                    <button @click="navigateTo('reportes')">Generación de reportes</button>
                </div>
            </div>

            <div v-if="userRole === 'Almacenes' || userRole === 'Administrador'" class="nav-item"
                @mouseenter="showMenu('polizaMenu')" @mouseleave="hideMenu('polizaMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.polizaMenu">
                    <button @click="navigateTo('solicitudmaterial')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('existencia')">Entrada de artículos</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('poliza')"
                        style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Polizas</button>
                </div>
            </div>
        </div>

        <div class="search-bar">
            <div class="input-wrapper">
                <input type="text" v-model="searchQuery" placeholder="Buscar..." />
                <i class="fas fa-search"></i> <!-- Icono de la lupa -->
            </div>

            <!-- Botón para agregar nueva poliza -->
            <button class="add-poliza-btn" @click="redirectToAddPoliza">
                <i class="fas fa-file-invoice"></i> <i class="fas fa-plus"></i>
            </button>
        </div>

        <div class="contenedor-tabla">
            <table class="poliza-table">
                <thead>
                    <tr>
                        <th>Descripcion</th>
                        <th>Cobertura</th>
                        <th>Tipo de poliza</th>
                        <th>Calidad</th>
                        <th>Deducible</th>
                        <th>Prima</th>
                        <th>Cantidad</th>
                        <th>Limite de indemnización</th>
                        <th>Periodo de validación</th>
                        <th>Clausulas de clausulas_exclusion</th>
                        <th>Fecha de poliza</th>
                        <th>Documento</th>
                        <th>Fecha de registro</th>
                        <th>Acciones</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="poliza in paginatedpoliza" :key="poliza.id">
                        <td>{{ poliza.descripcion }}</td>
                        <td>{{ poliza.cobertura }}</td>
                        <td>{{ poliza.tipo }}</td>
                        <td>{{ poliza.calidad }}</td>
                        <td>{{ poliza.deducible }}</td>
                        <td>{{ poliza.prima }}</td>
                        <td>{{ poliza.cantidad }}</td>
                        <td>{{ poliza.limites_indemnizacion }}</td>
                        <td>{{ poliza.periodo_vigencia }}</td>
                        <td>{{ poliza.clausulas_exclusion }}</td>
                        <td>{{ poliza.fecha }}</td>
                        <td>
                            <template v-if="poliza.archivo">
                                <ul>
                                    <li v-for="(file, index) in getPdfFiles(poliza.archivo)" :key="index">
                                        <!-- Aplicar truncateFileName al nombre del archivo -->
                                        <a :href="file.url" target="_blank" :title="file.name">
                                            {{ truncateFileName(file.name, 20) }}
                                        </a>
                                    </li>
                                </ul>
                            </template>
                            <button @click="downloadZip(poliza)" class="btn-download">
                                <p class="textoDescarga">Descargar</p>
                            </button>
                        </td>
                        <td>{{ formatDate(poliza.createdAt) }}</td>
                        <td>
                            <button @click="editpoliza(poliza)" class="btn-edit">Editar</button>
                            <button @click="showDeleteModal(poliza.id)" class="btn-delete">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Modal de Edición -->
            <div v-if="isEditing" class="edit-modal">
                <div class="modal-content">
                    <h3>Editar Póliza</h3>
                    <form @submit.prevent="saveChanges" class="edit-form">
                        <div class="contenedorformulario">
                            <div class="form-column">
                                <div>
                                    <label>Descripción:</label>
                                    <input v-model="currentPoliza.descripcion" type="text" />
                                </div>
                                <div>
                                    <label>Cobertura:</label>
                                    <input v-model="currentPoliza.cobertura" type="text" />
                                </div>
                                <div>
                                    <label>Tipo de póliza:</label>
                                    <input v-model="currentPoliza.tipo" type="text" />
                                </div>
                                <div>
                                    <label>Calidad:</label>
                                    <input v-model="currentPoliza.calidad" type="text" />
                                </div>
                                <div>
                                    <label>Deducible:</label>
                                    <input v-model="currentPoliza.deducible" type="text" />
                                </div>
                                <div>
                                    <label>Prima:</label>
                                    <input v-model="currentPoliza.prima" type="text" />
                                </div>
                                <div>
                                    <label>Cantidad:</label>
                                    <input v-model="currentPoliza.cantidad" type="text" />
                                </div>
                            </div>

                            <div class="form-column">
                                <div>
                                    <label>Límite de indemnización:</label>
                                    <input v-model="currentPoliza.limites_indemnizacion" type="text" />
                                </div>
                                <div>
                                    <label>Periodo de validación:</label>
                                    <input v-model="currentPoliza.periodo_vigencia" type="date" />
                                </div>
                                <div>
                                    <label>Cláusulas de exclusión:</label>
                                    <input v-model="currentPoliza.clausulas_exclusion" type="text" />
                                </div>
                                <div>
                                    <label>Fecha de póliza:</label>
                                    <input v-model="currentPoliza.fecha" type="date" />
                                </div>
                                <div class="contenedor-dropzone">
                                    <label for="archivo">Documento (PDF, JPG, PNG)</label>
                                    <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent
                                        @click="triggerFileInput">
                                        <!-- Campo de subida de archivo -->
                                        <input type="file" id="archivo" ref="fileInput" @change="handleFileChange"
                                            accept=".pdf,.jpg,.png" style="display: none;" multiple />

                                        <!-- Ícono y mensaje -->
                                        <i class="fas fa-cloud-upload-alt"></i>
                                        <span v-if="!currentPoliza.archivo">
                                            Arrastra aquí o haz clic para subir un archivo
                                        </span>
                                        <span v-else>
                                            Archivo: {{ currentPoliza.archivo }}
                                        </span>
                                    </div>
                                    <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
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
        <!-- Contenedor de notificaciones -->
        <div v-if="alertMessage" :class="alertClass" class="notification">
            <i :class="alertIcon"></i> {{ alertMessage }}
        </div>
    </div>
</template>

<script>
export default {
    name: "polizasPage",
    data() {
        return {
            alertMessage: "",  // Mensaje de la alerta
            alertClass: "",    // Clase de la alerta (ej. 'success' o 'error')
            alertIcon: "",     // Icono para la alerta
            userRole: localStorage.getItem('userRole') || '', // Obtener el rol desde el localStorage
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario
            isDeleteModalVisible: false,
            menus: {
                homeMenu: false,
                polizaMenu: false,
                settingsMenu: false,
            },
            searchQuery: '',
            currentPage: 1,
            polizaPerPage: 10,
            isEditing: false, // Para controlar si estamos en modo de edición
            currentPoliza: {}, // Objeto para almacenar la póliza que se está editando
            poliza: [], // Inicializar como un array vacío
        };
    },
    computed: {
        filteredpoliza() {
            const query = this.searchQuery.toLowerCase();
            return this.poliza.filter(poliza => {
                return poliza.descripcion.toLowerCase().includes(query) ||
                    poliza.cobertura.toLowerCase().includes(query) ||
                    poliza.tipo.toLowerCase().includes(query) ||
                    poliza.calidad.toLowerCase().includes(query);
            });
        },
        totalPages() {
            return Math.ceil(this.filteredpoliza.length / this.polizaPerPage);
        },
        paginatedpoliza() {
            const start = (this.currentPage - 1) * this.polizaPerPage;
            const end = start + this.polizaPerPage;
            return this.filteredpoliza.slice(start, end);
        }
    },
    mounted() {
        this.loadUserData();
        this.fetchPolizas();
    },
    methods: {
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('es-MX', options); // Usando la configuración en español de México
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
        showAlert(message, type) {
            this.alertMessage = message;
            if (type === "success") {
                this.alertClass = "alert-success";
                this.alertIcon = "fa fa-check-circle";
            } else if (type === "error") {
                this.alertClass = "alert-error";
                this.alertIcon = "fa fa-times-circle";
            } else {
                this.alertClass = "alert-warning";
                this.alertIcon = "fa fa-exclamation-circle";
            }

            // Ocultar la alerta después de 3 segundos
            setTimeout(() => {
                this.alertMessage = "";
            }, 3000);
        },
        async fetchPolizas() {
            try {
                const response = await fetch("http://localhost:3000/api/polizas");
                if (!response.ok) {
                    throw new Error("Error al obtener pólizas");
                }
                this.poliza = await response.json(); // Asignar los datos a this.poliza
            } catch (error) {
                console.error("Error al cargar las pólizas:", error);
            }
        },
        triggerFileInput() {
            this.$refs.fileInput.click(); // Abre el explorador de archivos al hacer clic
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
                    url: `http://localhost:3000/api/polizas-files/${nameWithoutExtension}`, // URL sin extensión para visualización
                    downloadUrl: `http://localhost:3000/api/polizas-files/${nameWithoutExtension}`, // URL sin extensión para descarga
                    name: nameWithoutExtension // Nombre sin extensión
                };
            });
        },

        async downloadZip(poliza) {
            try {
                // Obtener los archivos PDF
                const pdfFiles = this.getPdfFiles(poliza.archivo);

                // Verificar si hay archivos para descargar
                if (pdfFiles.length === 0) {
                    this.showAlert("No hay archivos para descargar", "error");
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
                this.showAlert('Hubo un error al descargar los archivos PDF. Por favor, inténtalo de nuevo', "error");
            }
        },


        handleDrop(event) {
            const files = event.dataTransfer.files;
            if (files.length > 1) {
                this.errorMessage = "Solo se permite subir un archivo.";
                return;
            }
            this.errorMessage = ''; // Limpiar el mensaje de error si no hay error
            const file = files[0];
            if (file) {
                this.currentPoliza.archivo = file.name; // Guarda solo el nombre del archivo
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
        // Método para manejar el cambio de archivo (solo almacena el archivo)
        handleFileChange(event) {
            const files = event.target.files;
            if (files.length === 0) return; // Si no hay archivos, no hacer nada

            this.selectedFile = files[0]; // Guardamos el archivo temporalmente
        },

        // Método para editar una poliza
        editpoliza(poliza) {
            this.currentPoliza = { ...poliza }; // Copiar datos de la poliza
            this.isEditing = true; // Abrir el modal de edición
            this.selectedFile = null; // Resetear archivo seleccionado
        },

        async saveChanges() {
            try {
                // 1. Actualizar los datos de la poliza
                const response = await fetch(`http://localhost:3000/api/polizas/${this.currentPoliza.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...this.currentPoliza                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al actualizar la poliza');
                }

                // 2. Subir el archivo si se seleccionó uno
                if (this.selectedFile) {
                    const formData = new FormData();
                    formData.append('archivo', this.selectedFile);

                    const fileResponse = await fetch(`http://localhost:3000/api/polizas/${this.currentPoliza.id}/reemplazar-archivo`, {
                        method: 'PUT',
                        body: formData,
                    });

                    if (!fileResponse.ok) {
                        throw new Error('Error al subir el archivo');
                    }
                }

                // Mensaje de éxito
                this.showAlert('Poliza actualizada correctamente', "success");

                // Recargar la lista de polizas y cerrar el modal
                await this.fetchPolizas();
                this.isEditing = false;
                this.currentPoliza = {};
                this.selectedFile = null; // Limpiar el archivo seleccionado después de guardar
            } catch (error) {
                console.error('Error:', error);
                this.showAlert(error.message || 'Hubo un error al actualizar la poliza. Por favor, inténtalo de nuevo', "error");
            }
        },
        cancelEdit() {
            this.isEditing = false;
            this.currentPoliza = {}; // Limpiar el objeto
        },
        showDeleteModal(id) {
            this.deleteId = id;
            this.isDeleteModalVisible = true;
        },
        async confirmDelete() {
            try {
                const response = await fetch(`http://localhost:3000/api/polizas/${this.deleteId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar la poliza');
                }

                // Si la eliminación fue exitosa, actualiza la lista de polizas
                // Mostrar una notificación de éxito
                this.showAlert("Poliza eliminada correctamente", "success");
                this.fetchPolizas();
            } catch (error) {
                console.error('Error:', error);
                this.showAlert('Hubo un error al eliminar la poliza. Por favor, inténtalo de nuevo', "error");
            } finally {
                this.isDeleteModalVisible = false;
                this.deleteId = null;
            }
        },
        cancelDelete() {
            this.isDeleteModalVisible = false;
            this.deleteId = null;
        },
        redirectToAddPoliza() {
            // Aquí defines la ruta a la que quieres redirigir al hacer clic en el botón
            this.$router.push('/newpoliza');
        },
    }
};
</script>

<style scoped>
/* Aplicar Montserrat a todo el contenido */
* {
    font-family: 'Montserrat', sans-serif;
}


/* Estilo general para la notificación */
.notification {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    color: white;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 999;
    max-width: 80%;
    opacity: 0;
    animation: fadeIn 0.5s forwards;
}

/* Animación de aparición de la notificación */
@keyframes fadeIn {
    0% {
        opacity: 0;
        top: 0;
    }

    100% {
        opacity: 1;
        top: 20px;
    }
}

/* Notificación de éxito */
.alert-success {
    background-color: #4CAF50;
    /* Verde */
}

/* Notificación de error */
.alert-error {
    background-color: #f44336;
    /* Rojo */
}

/* Notificación de advertencia */
.alert-warning {
    background-color: #ff9800;
    /* Naranja */
}

/* Iconos de la alerta */
.notification i {
    margin-right: 10px;
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

.poliza-table {
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

.poliza-table th,
.poliza-table td {
    padding: 10px;
    text-align: center;
}

.poliza-table th {
    background-color: #BC955B;
    color: white;
}

.poliza-table tr:hover {
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



.add-poliza-btn {
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

.add-poliza-btn:hover {
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