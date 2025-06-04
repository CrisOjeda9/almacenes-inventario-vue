<template>
    <div class="page-wrapper">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        <NavBarPage :pageTitle="'Nuevo Proveedor'" :showUserMenu="true" />
        <div class="container">
            <div class="form-container">
                <form @submit.prevent="registerProveedor">
                    <div class="form-row">
                        <!-- Nombre -->
                        <div class="form-field">
                            <label for="nombre">Nombre</label>
                            <input type="text" id="nombre" v-model="form.nombre" required />
                        </div>

                        <!-- Apellidos -->
                        <div class="form-field">
                            <label for="apellidos">Apellidos</label>
                            <input type="text" id="apellidos" v-model="form.apellidos" required />
                        </div>

                        <!-- Tipo de Proveedor -->
                        <div class="form-field">
                            <label for="tipo_proveedor">Tipo de proveedor</label>
                            <select id="tipo_proveedor" v-model="form.tipo_proveedor" required>
                                <option value="" disabled>Selecciona una opción</option>
                                <option value="Fisico">Físico</option>
                                <option value="Moral">Moral</option>
                            </select>
                        </div>

                        <!-- RFC -->
                        <div class="form-field">
                            <label for="RFC">RFC</label>
                            <input type="text" v-model="form.RFC" minlength="13" maxlength="13"
                                style="text-transform: uppercase;" required />
                        </div>
                    </div>

                    <div class="form-row">
                        <!-- Dirección -->
                        <div class="form-field">
                            <label for="direccion">Dirección</label>
                            <input type="text" id="direccion" v-model="form.direccion" required />
                        </div>

                        <!-- Telefono -->
                        <div class="form-field">
                            <label for="telefono">Telefono</label>
                            <input type="tel" id="telefono" v-model="form.telefono" required />
                        </div>

                        <!-- Email Electrónico -->
                        <div class="form-field">
                            <label for="email">Email electrónico</label>
                            <input type="email" id="email" v-model="form.email" required />
                        </div>

                        <!-- Cuenta Bancaria -->
                        <div class="form-field">
                            <label for="cuenta_bancaria">Cuenta bancaria</label>
                            <input type="text" id="cuenta_bancaria" v-model="form.cuenta_bancaria" required />
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-field">
                            <label for="archivos">archivos</label>
                            <div class="dropzone" @drop.prevent="handleDrop('archivos')" @dragover.prevent
                                @click="triggerFileInput('archivos')">
                                <input type="file" id="archivos" ref="fileInputDoc" @change="handleFileUpload('archivos')"
                                    accept=".pdf" multiple />
                                <i class="fas fa-cloud-upload-alt"></i>
                                <span v-if="form.archivos.length === 0">Arrastra o selecciona archivos (PDF)</span>
                                <span v-else>{{ form.archivos.length }} archivos seleccionados</span>
                                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                            </div>

                            <button type="button" v-if="form.archivos.length > 0" @click="openDocumentModal"
                                class="view-documents-btn">
                                Ver archivos
                            </button>
                        </div>


                    </div>

                    <div class="button-container">
                        <button class="boton" type="submit">
                            <i class="fas fa-plus"></i> Agregar Proveedor
                        </button>
                    </div>
                </form>
            </div>

            <!-- Modal -->
            <div v-if="showModal" class="modal">
                <div class="modal-content">
                    <h2>Proveedor registrado con éxito.</h2>
                    <button @click="closeModal">Aceptar</button>
                </div>
            </div>
            <!-- Modal para mostrar los archivos cargados -->
            <div v-if="showDocumentModal" class="modal-overlay2">
                <div class="modal2">
                    <h2>archivos Cargados</h2>
                    <div class="document-list2">
                        <div v-for="(doc, index) in form.archivos" :key="index" class="document-item2">
                            <span>{{ doc.name }}</span>
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
    name: "newProveedorPage",
    components: {
        NavBarPage // Registrar el componente
    },
    data() {
        return {
            alertMessage: "",  // Mensaje de la alerta
            alertClass: "",    // Clase de la alerta (ej. 'success' o 'error')
            alertIcon: "",     // Icono para la alerta
            userRole: localStorage.getItem('userRole') || '', // Obtener el rol desde el localStorage
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario
            form: {
                nombre: "",
                apellidos: "",
                tipo_proveedor: "",
                RFC: "",
                direccion: "",
                telefono: "",
                email: "",
                cuenta_bancaria: "",
                archivos: [], // Inicializa como array vacío
            },
            menus: {
                homeMenu: false,
                proveedorMenu: false,
                settingsMenu: false,
                userMenu: false,
            },
            showModal: false, // Modal de éxito
            showDocumentModal: false, // Controla la visibilidad del modal de archivos
            errorMessage: "", // Mensaje de error
            showAlertModal: false,
        };
    },
    mounted() {
        this.loadUserData();
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
        goHome() {
            this.$router.push('home'); // Redirige a la página principal ("/").
        },
        openDocumentModal() {
            this.showDocumentModal = true;
        },

        // Método para cerrar el modal de archivos
        closeDocumentModal() {
            this.showDocumentModal = false;
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

        handleFileUpload(type) {
            if (type === "archivos") {
                const input = this.$refs.fileInputDoc;
                const files = Array.from(input.files); // Convierte FileList a un array

                // Validar el límite de 10 archivos
                if (files.length + this.form.archivos.length > 10) {
                    this.showAlert("No se pueden subir más de 10 archivos", "error");
                    return;
                }

                // Agregar los archivos al array
                this.form.archivos = [...this.form.archivos, ...files];
                this.errorMessage = ""; // Limpiar el mensaje de error
            } else if (type === "Foto") {
                this.form.imagen = this.$refs.fileInputFoto.files[0];
            }
        },



        // Método para eliminar un documento
        removeDocument(index) {
            this.form.archivos.splice(index, 1); // Elimina el documento del array
        },
        // Cerrar modal de éxito
        closeModal() {
            this.showModal = false;
            this.$router.push("/proveedor"); // Redirigir a la lista de usuarios
        },

        closeAlertModal() {
            this.showAlertModal = false; // Cierra el modal de alerta+
        },


        async registerProveedor() {
            if (!this.form.nombre || !this.form.apellidos || !this.form.tipo_proveedor || !this.form.RFC ||
                !this.form.direccion || !this.form.telefono || !this.form.email || !this.form.cuenta_bancaria) {
                this.showAlert("Por favor, completa todos los campos obligatorios.", "error");
                return;
            }

            try {
                const formData = new FormData();
                formData.append("nombre", this.form.nombre);
                formData.append("apellidos", this.form.apellidos);
                formData.append("tipo_proveedor", this.form.tipo_proveedor);
                formData.append("RFC", this.form.RFC);
                formData.append("direccion", this.form.direccion);
                formData.append("telefono", this.form.telefono);
                formData.append("email", this.form.email);
                formData.append("cuenta_bancaria", this.form.cuenta_bancaria);

                this.form.archivos.forEach((file) => {
                    formData.append('archivos', file);
                });

                await api.post("/proveedor", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                // Mostrar el modal en lugar de la alerta
                this.showModal = true;

            } catch (error) {
                console.error("Error al enviar los datos:", error);
                this.showAlert("Hubo un error al registrar el proveedor", "error");
            }
        },


        triggerFileInput(type) {
            if (type === "archivos") {
                this.$refs.fileInputDoc.click();
            }
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
    },
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

.modal {
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: white;
    color: #691B31;
    padding: 20px;
    border-radius: 20px;
    width: 500px;
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

/* Formulario */
.form-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;


}

form {
    background: white;
    padding: 30px;
    padding-bottom: 80px;
    border-radius: 10px;
    width: auto;
    height: auto;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.form-row {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    padding-bottom: 15px;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
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
}


label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    color: #691B31;

}

a {
    text-decoration: none;

}

/* Estilo para la fila de campos */
.form-row {
    display: flex;
    gap: 20px;
    /* Espacio entre los campos en la misma fila */
    flex-wrap: wrap;
    /* Permite que los campos se ajusten a nuevas filas si no caben */
}

/* Estilo para cada campo en la fila */
.form-field {
    flex: 1;
    /* Cada campo ocupa un 100% del ancho disponible dentro de la fila */
    min-width: 200px;
    /* Establece un ancho mínimo para que no se colapse */

}

/* Estilo de los inputs dentro de la fila */
.form-field input,
.form-field select,
.form-field textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
}




/* Estilos del Dropzone */
.dropzone {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed #98989A;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s ease;
    width: 100%;
    /* Ocupa todo el ancho disponible */
    height: auto;
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



.dropzone span {
    font-size: 13px;
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
</style>