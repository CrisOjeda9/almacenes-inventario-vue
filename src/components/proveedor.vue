<template>
    <div class="page-wrapper">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        <NavBarPage :pageTitle="'Proveedores'" :showUserMenu="true" />
        <div class="container">
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
                <div class="table-horizontal-scroll">
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
                                <td>{{ proveedor.tipo_proveedor }}</td>
                                <td>{{ proveedor.RFC }}</td>
                                <td>{{ proveedor.direccion }}</td>
                                <td>{{ proveedor.telefono }}</td>
                                <td>{{ proveedor.email }}</td>
                                <td>{{ proveedor.cuenta_bancaria }}</td>
                                <td>
                                    <template v-if="proveedor.archivos">
                                        <ul>
                                            <li v-for="(file, index) in getPdfFiles(proveedor.archivos)" :key="index">
                                                <!-- Aplicar truncateFileName al nombre del archivo -->
                                                <a :href="file.url" target="_blank" :title="file.name">
                                                    {{ truncateFileName(file.name, 20) }}
                                                </a>
                                            </li>
                                        </ul>
                                    </template>
                                    <!-- Botón para descargar todos los archivos en un ZIP -->
                                    <button @click="downloadZip(proveedor)" class="btn-download">
                                        <p class="textoDescarga">Descargar</p>
                                    </button>
                                </td>
                                <td>{{ formatDate(proveedor.createdAt) }}</td>

                                <td>
                                    <button @click="editproveedor(proveedor)" class="btn-edit">Editar</button>
                                    <button @click="showDeleteModal(proveedor.id)" class="btn-delete">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

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
                                    <div style="width: 100%; margin-left: 0px;">
                                        <label>Tipo de Proveedor:</label>
                                        <select v-model="currentProveedor.tipo_proveedor" class="form-input">
                                            <option value="" disabled>Selecciona el tipo de proveedor</option>
                                            <option value="Fisico">Físico</option>
                                            <option value="Moral">Moral</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>RFC:</label>
                                        <input v-model="currentProveedor.RFC" type="text" />
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
                                        <label>email Electrónico:</label>
                                        <input v-model="currentProveedor.email" type="email" class='email' />
                                    </div>
                                    <div>
                                        <label>Cuenta Bancaria:</label>
                                        <input v-model="currentProveedor.cuenta_bancaria" type="text" />
                                    </div>
                                </div>
                                <!-- Tercera columna (Archivos) -->
                                <div class="form-column">
                                    <div class="form-field">
                                        <label for="archivos">Archivos</label>
                                        <div class="dropzone" @drop.prevent="handleDrop('archivos')" @dragover.prevent
                                            @click="triggerFileInput('archivos')">
                                            <input type="file" id="archivos" ref="fileInputDoc"
                                                @change="handleFileUpload('archivos')" accept=".pdf" multiple />
                                            <i class="fas fa-cloud-upload-alt"></i>
                                            <span v-if="currentProveedor.archivos.length === 0">Arrastra o selecciona
                                                archivos
                                                (PDF)</span>
                                            <span v-else>{{ currentProveedor.archivos.length }} archivos
                                                seleccionados</span>
                                            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                                        </div>
                                        <button type="button" v-if="currentProveedor.archivos.length > 0"
                                            @click="openDocumentModal" class="view-documents-btn">
                                            Ver archivos
                                        </button>
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
            <!-- Modal para mostrar los archivos cargados -->
            <div v-if="showDocumentModal" class="modal-overlay2">
                <div class="modal2">
                    <h2>Archivos Cargados</h2>
                    <div class="document-list2">
                        <div v-for="(doc, index) in currentProveedor.archivos" :key="index" class="document-item2">
                            <!-- Mostrar solo el nombre del archivo sin la ruta -->
                            <span>{{ getFileName(doc) }}</span>
                            <button @click="removeDocument(index)" class="remove-btn2">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <button @click="closeDocumentModal">Cerrar</button>
                </div>
            </div>
            <!-- Contenedor de notificaciones -->
            <div v-if="alertMessage" :class="alertClass" class="notification">
                <i :class="alertIcon"></i> {{ alertMessage }}
            </div>
        </div>
    </div>
</template>

<script>
import api from '../services/api';
import NavBarPage from './NavBar.vue';
export default {
    name: "proveedorPage",
    components: {
        NavBarPage // Registrar el componente
    },
    data() {
        return {
            alertMessage: "",  // Mensaje de la alerta
            alertClass: "",    // Clase de la alerta (ej. 'success' o 'error')
            alertIcon: "",     // Icono para la alerta
            isEditing: false, // Controla si estamos en modo de edición
            currentProveedor: {
                archivos: [], // Archivos del proveedor
            },
            showDocumentModal: false, // Controla la visibilidad del modal de archivos
            errorMessage: "", // Mensaje de error

            userRole: localStorage.getItem('userRole') || '', // Obtener el rol desde el localStorage
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario
            isDeleteModalVisible: false,
            menus: {
                homeMenu: false,
                proveedorMenu: false,
                settingsMenu: false,
                userMenu: false,
            },
            searchQuery: '',
            currentPage: 1,
            proveedorPerPage: 10,
            proveedor: [], // Lista de proveedores
            archivosAEliminar: [], // Lista de archivos marcados para eliminación

        };
    },
    computed: {
        filteredproveedor() {
            const query = this.searchQuery.toLowerCase();
            return this.proveedor.filter(proveedor => {
                return (proveedor.nombre && proveedor.nombre.toLowerCase().includes(query)) ||
                    (proveedor.apellidos && proveedor.apellidos.toLowerCase().includes(query)) ||
                    (proveedor.tipo_proveedor && proveedor.tipo_proveedor.toLowerCase().includes(query)) ||
                    (proveedor.RFC && proveedor.RFC.toLowerCase().includes(query)) ||
                    (proveedor.direccion && proveedor.direccion.toLowerCase().includes(query)) ||
                    (proveedor.email && proveedor.email.toLowerCase().includes(query)) ||
                    (proveedor.telefono.toString().toLowerCase().includes(query)) ||
                    (proveedor.cuenta_bancaria && proveedor.cuenta_bancaria.toLowerCase().includes(query));
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
    mounted() {
        this.loadUserData();
        this.loadProveedores();  // Cargar los proveedores desde la API
    },
    methods: {
        async loadUserData() {
            const storedUserName = localStorage.getItem("userName");
            const storedUserEmail = localStorage.getItem("userEmail");

            if (storedUserName && storedUserEmail) {
                this.userName = storedUserName;

                try {
                    // Obtener todos los usuarios de la API
                    const response = await api.get('/personas');
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
                            this.profileImage = `http://192.168.10.31:3000/api/users-files/${imageFileName}`;
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
        async loadProveedores() {
            try {
                const response = await api.get('/proveedor');
                this.proveedor = response.data; // Asignar los datos obtenidos a la lista de proveedores
            } catch (error) {
                console.error('Error al cargar los proveedores:', error);
            }
        },

        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('es-MX', options);
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
        editproveedor(proveedor) {
            this.currentProveedor = { ...proveedor };
            // Convertir archivos existentes a un formato manejable
            if (proveedor.archivos) {
                this.currentProveedor.archivos = proveedor.archivos.split(';').map(file => file.trim());
            } else {
                this.currentProveedor.archivos = [];
            }
            this.isEditing = true;
        },

        cancelEdit() {
            this.isEditing = false;
            this.currentProveedor = {}; // Limpiar el objeto
        },

        showDeleteModal(id) {
            this.deleteId = id;
            this.isDeleteModalVisible = true;
        },
        async confirmDelete() {
            try {
                // Hacer la solicitud DELETE a la API
                await api.delete(`/proveedor/${this.deleteId}`);

                // Si la eliminación es exitosa, eliminar el proveedor de la lista local
                const index = this.proveedor.findIndex(proveedor => proveedor.id === this.deleteId);
                if (index !== -1) {
                    this.proveedor.splice(index, 1); // Eliminar proveedor de la lista
                }

                // Cerrar el modal y resetear la id de eliminación
                this.isDeleteModalVisible = false;
                this.deleteId = null;

                // Opcional: Puedes mostrar un mensaje de éxito aquí si lo deseas.
            } catch (error) {
                console.error('Error al eliminar el proveedor:', error);
                // Puedes mostrar un mensaje de error si lo deseas
            }
        },

        cancelDelete() {
            this.isDeleteModalVisible = false;
            this.deleteId = null;
        },
        redirectToAddproveedor() {
            this.$router.push('/newproveedor');
        },
        truncateFileName(name, maxLength) {
            return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
        },
        getFileName(file) {
            if (typeof file === 'string') {
                // Si es una cadena (ruta), extraer el nombre del archivo
                return file.split('/').pop().split('\\').pop();
            } else if (file instanceof File) {
                // Si es un objeto File, devolver el nombre del archivo
                return file.name;
            }
            return ''; // En caso de que no sea ni una cadena ni un objeto File
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
                    url: `http://192.168.10.31:3000/api/proveedores-files/${nameWithoutExtension}`, // URL sin extensión para visualización
                    downloadUrl: `http://192.168.10.31:3000/api/proveedores-files/${fileName}`, // URL con extensión para descarga
                    name: nameWithoutExtension // Nombre sin extensión
                };
            });
        },
        async downloadZip(proveedor) {
            try {
                // Obtener los nombres de los archivos
                const pdfFiles = this.getPdfFiles(proveedor.archivos);

                // Extraer solo los nombres de los archivos con extensión
                const fileNames = pdfFiles.map(file => {
                    const fileNameWithExtension = file.name + '.pdf'; // Asegúrate de incluir la extensión
                    return fileNameWithExtension;
                });

                // Enviar los nombres de los archivos a la API de descarga ZIP
                const response = await api.get('/proveedores/download-zip', {
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

                // Crear un nombre de archivo basado en el nombre y apellidos del proveedor
                const nombreArchivo = `${proveedor.nombre}_${proveedor.apellidos}.zip`.replace(/\s+/g, '_'); // Reemplazar espacios con guiones bajos

                // Crear un enlace para descargar el archivo ZIP
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = nombreArchivo; // Usar el nombre formateado
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error al descargar el archivo ZIP. Por favor, inténtalo de nuevo.');
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
        // Método para activar el input de archivo
        triggerFileInput(type) {
            if (type === "archivos") {
                this.$refs.fileInputDoc.click(); // Simula un clic en el input de archivo
            }
        },

        // Método para manejar la selección de archivos
        handleFileUpload(type) {
            if (type === "archivos") {
                const input = this.$refs.fileInputDoc;
                const files = Array.from(input.files); // Convierte FileList a un array

                // Validar el límite de 10 archivos
                if (files.length + this.currentProveedor.archivos.length > 10) {
                    this.showAlert("No se pueden subir más de 10 archivos", "error");
                    return;
                }

                // Agregar los archivos al array
                this.currentProveedor.archivos = [...this.currentProveedor.archivos, ...files];
                this.errorMessage = ""; // Limpiar el mensaje de error
            }
        },
        // Método para eliminar un archivo del servidor
        async deleteFile(fileName) {
            try {
                // Obtener el ID del proveedor actual
                const proveedorId = this.currentProveedor.id;

                // Enviar la solicitud DELETE al backend
                await api.delete(`/proveedor/${proveedorId}/archivos`, {
                    data: { fileName: fileName } // Enviar el nombre del archivo en el cuerpo
                });

                // Eliminar el archivo de la lista local
                const index = this.currentProveedor.archivos.findIndex(file => {
                    if (typeof file === 'string') {
                        return file.includes(fileName);
                    } else if (file instanceof File) {
                        return file.name === fileName;
                    }
                    return false;
                });

                if (index !== -1) {
                    this.currentProveedor.archivos.splice(index, 1);
                }

                // Mostrar una notificación de éxito
                this.showAlert("Archivo eliminado correctamente", "success");
            } catch (error) {
                console.error("Error al eliminar el archivo:", error);
                this.showAlert("Hubo un error al eliminar el archivo", "error");
            }
        },
        removeDocument(index) {
            const file = this.currentProveedor.archivos[index];

            // Extraer el nombre del archivo
            let fileName;
            if (typeof file === 'string') {
                // Si es una cadena (ruta), extraer el nombre del archivo
                fileName = file.split('/').pop().split('\\').pop(); // Extrae "archivo1.pdf"
            } else if (file instanceof File) {
                // Si es un objeto File, obtener el nombre directamente
                fileName = file.name;
            } else {
                console.error("Formato de archivo no válido:", file);
                return;
            }

            // Agregar el archivo a la lista de archivos a eliminar
            this.archivosAEliminar.push(fileName);

            // Eliminar el archivo de la lista local
            this.currentProveedor.archivos.splice(index, 1);
        },



        // Método para abrir el modal de visualización de archivos
        openDocumentModal() {
            this.showDocumentModal = true;
        },

        // Método para cerrar el modal de visualización de archivos
        closeDocumentModal() {
            this.showDocumentModal = false;
        },

        // Método para guardar los cambios
        // Método para guardar los cambios
        async saveChanges() {
            try {
                // 1. Enviar los cambios generales del proveedor
                const formData = new FormData();
                formData.append("nombre", this.currentProveedor.nombre);
                formData.append("apellidos", this.currentProveedor.apellidos);
                formData.append("tipo_proveedor", this.currentProveedor.tipo_proveedor);
                formData.append("RFC", this.currentProveedor.RFC);
                formData.append("direccion", this.currentProveedor.direccion);
                formData.append("telefono", this.currentProveedor.telefono);
                formData.append("email", this.currentProveedor.email);
                formData.append("cuenta_bancaria", this.currentProveedor.cuenta_bancaria);

                // Enviar la solicitud PUT a la API para actualizar el proveedor
                await api.put(`/proveedor/${this.currentProveedor.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                // 2. Eliminar los archivos marcados para eliminación
                if (this.archivosAEliminar.length > 0) {
                    for (const fileName of this.archivosAEliminar) {
                        await api.delete(`/proveedor/${this.currentProveedor.id}/archivos`, {
                            data: { fileName: fileName }
                        });
                    }
                    this.archivosAEliminar = []; // Limpiar la lista de archivos a eliminar
                }

                // 3. Agregar los archivos nuevos
                const nuevosArchivos = this.currentProveedor.archivos.filter(file => file instanceof File);
                if (nuevosArchivos.length > 0) {
                    const archivosFormData = new FormData();
                    nuevosArchivos.forEach((file) => {
                        archivosFormData.append('archivos', file);
                    });

                    // Enviar los archivos nuevos al backend
                    await api.post(`/proveedor/${this.currentProveedor.id}/archivos`, archivosFormData, {
                        headers: { "Content-Type": "multipart/form-data" }
                    });
                }

                // Cerrar el modal y recargar los proveedores
                this.isEditing = false;
                this.loadProveedores();
                this.showAlert("Proveedor actualizado con éxito", "success");
            } catch (error) {
                console.error("Error al actualizar el proveedor:", error);
                this.showAlert("Hubo un error al actualizar el proveedor", "error");
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

.dropzone {
    position: relative;
    border: 2px dashed #007bff;
    border-radius: 8px;
    background-color: #f8f9fa;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease;
    height: 170px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.dropzone:hover {
    background-color: #e3f2fd;
    border-color: #0056b3;
}

.dropzone input[type="file"] {
    display: none;
}

.dropzone i {
    font-size: 32px;
    color: #007bff;
    margin-bottom: 10px;
}

.dropzone span {
    display: block;
    font-size: 14px;
    color: #555;
}

.dropzone p.error-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
}

form .view-documents-btn {
    background-color: #a02142;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.view-documents-btn:hover {
    background-color: #218838;
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


.view-documents-btn {
    display: flex;
    justify-content: center;
    position: relative;
    width: 100%;
    background-color: #691b31;
    color: white;
    border: none;
    padding: 5px;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 2px;
    font-size: 15px;
}

.modal-overlay2 {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    /* Asegúrate de que el modal esté por encima de otros elementos */
}

.modal2 {

    background: white;
    color: #691B31;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
}

.modal-overlay2.show {
    visibility: visible;
}

.modal2 button {
    padding: 10px 20px;
    background-color: #BC955B;
    color: white;
    border: none;
    border-radius: 5px;
    margin-top: 10px;
    cursor: pointer;

}

.modal2 button:hover {
    background-color: #691B31;
}


.document-list2 {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    gap: 1px;
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
.proveedor-table {
    width: 100%;
    /* Ocupa todo el ancho disponible */
    max-width: 1200px;
    /* Limita el ancho máximo */
    border-collapse: separate;
    border-spacing: 0;
    background-color: white;
    color: #691B31;
    font-size: 14px;
    border-radius: 15px;
    overflow: hidden;
    table-layout: auto;
    /* Ajusta el ancho según el contenido */
    margin: 0 auto;
}

.proveedor-table th,
.proveedor-table td {
    padding: 5px;
    text-align: center;
    white-space: normal; /* Cambiar de nowrap a normal */
    word-wrap: break-word; /* Permitir división de palabras */
    min-width: 50px;
    max-width: 100px; /* Agregar ancho máximo */
    overflow-wrap: break-word; /* Para navegadores modernos */
    hyphens: auto; /* Guiones automáticos */
}

.proveedor-table th {
    background-color: #BC955B;
    color: white;
    position: sticky;
    top: 0;
    z-index: 3;
}

/* Efecto hover mejorado */
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


.table-horizontal-scroll {
    overflow-x: auto;
    /* Solo scroll horizontal */
    overflow-y: visible;
    /* Sin scroll vertical */
    border-radius: 15px;
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
    right: 0; /* Agregar right: 0 */
    bottom: 0; /* Agregar bottom: 0 */
    width: 100%; /* Asegurar 100% de ancho */
    height: 100%; /* Asegurar 100% de alto */
    background: rgba(0, 0, 0, 0.7); /* Hacer el fondo más oscuro */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* Z-index muy alto */
    padding: 20px; /* Agregar padding */
    overflow-y: auto; /* Permitir scroll si es necesario */
}

.modal-content {
    color: white;
    text-align: center;
    font-size: 30px;
    background: #691B31;
    padding: 10px;
    border-radius: 25px;
    width: 100%;
    max-width: 900px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 60px;
}


.contenedorformulario {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
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
/* Correcciones para que aparezca la scroll bar horizontal */

.table-horizontal-scroll {
    overflow-x: auto; /* Scroll horizontal */
    overflow-y: visible; /* Sin scroll vertical */
    border-radius: 15px;
    width: 100%; /* Asegurar que tenga un ancho definido */
    max-width: 100%; /* Limitar el ancho máximo */
    /* Agregar estas propiedades para forzar el scroll */
    display: block;
    white-space: nowrap; /* Evitar que el contenido se ajuste */
}




.contenedor-tabla {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    /* Agregar esto para controlar el desbordamiento */
    overflow: hidden;
    max-width: 100vw; /* No exceder el ancho de la ventana */
}



/* Media queries actualizadas */
@media (max-width: 768px) {
   
    
    .table-horizontal-scroll {
        max-width: calc(100vw - 20px); /* Considerar el padding */
    }
    
    .proveedor-table {
        min-width: 1000px;
    }
    
    .proveedor-table th,
    .proveedor-table td {
        padding: 8px 6px;
        font-size: 14px;
        min-width: 80px; /* Reducir un poco el ancho mínimo */
    }
}

@media (max-width: 480px) {
   
    
    .table-horizontal-scroll {
        max-width: calc(100vw - 10px);
    }
    
    .proveedor-table {
        min-width: 900px;
    }
    
    .proveedor-table th,
    .proveedor-table td {
        padding: 6px 4px;
        font-size: 12px;
        min-width: 70px;
    }
}
</style>