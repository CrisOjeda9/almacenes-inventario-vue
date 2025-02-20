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
                <h1>Nuevo Usuario</h1>
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

            <div class="nav-item" @mouseenter="showMenu('usersMenu')" @mouseleave="hideMenu('usersMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.usersMenu">
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

        <!-- Formulario -->
        <div class="form-container">
            <form @submit.prevent="registerUser">
                <div class="form-row">
                    <div class="form-field">
                        <label for="rol">Rol de usuario</label>
                        <select v-model="form.rol" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Inventario">Inventario</option>
                            <option value="Almacenes">Almacenes</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label for="nombre">Nombre(s)</label>
                        <input type="text" v-model="form.nombre" required />
                    </div>
                    <div class="form-field">
                        <label for="apellidos">Apellidos</label>
                        <input type="text" v-model="form.apellidos" required />
                    </div>
                    <div class="form-field">
                        <label for="RFC">RFC</label>
                        <input type="text" v-model="form.RFC" minlength="13" maxlength="13" required
                            style="text-transform: uppercase;" />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-field">
                        <label for="numero_trabajador">Num. Trabajador</label>
                        <input type="number" v-model="form.numero_trabajador" min="0" required />
                    </div>
                    <div class="form-field">
                        <label for="CURP">CURP</label>
                        <input type="text" v-model="form.CURP" minlength="18" maxlength="18" required
                            style="text-transform: uppercase;" />
                    </div>
                    <div class="form-field">
                        <label for="direccion_pertenencia">Direc. Pertenencia</label>
                        <select v-model="form.direccion_pertenencia" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="Direccion General">Dirección General</option>
                            <option value="Direccion de Coordinacion Financiera Y Planeacion">Dirección de Coordinación
                                Financiera y Planeación</option>
                            <option value="Direccion de Television">Dirección de Televisión</option>
                            <option value="Direccion de Noticias">Dirección de Noticias</option>
                            <option value="Direccion de Radio">Dirección de Radio</option>
                            <option value="Direccion de Ingenieria">Dirección de Ingeniería</option>
                            <option value="Direccion de Proyectos Estrategicos">Dirección de Proyectos Estratégicos
                            </option>
                            <option value="Organo Interno de Control">Órgano Interno de Control</option>
                            <option value="Direccion de Promocion e Intercambio">Dirección de Promoción e Intercambio
                            </option>
                            <option value="Direccion Juridica">Dirección Jurídica</option>
                            <option value="Direccion de Vinculacion">Dirección de Vinculación</option>
                            <option value="Estaciones de Radio">Estaciones de Radio</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label for="departamento">Departamento</label>
                        <input type="text" v-model="form.departamento" required />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-field">
                        <label for="organo_superior">Organo Superior</label>
                        <input type="text" value="Organismos Descentralizados" v-model="form.organo_superior"
                            readonly />
                    </div>
                    <div class="form-field">
                        <label for="area_presupuestal">Área Presupuestal</label>
                        <input type="text" value="RADIO Y TELEVISION DE HIDALGO" v-model="form.area_presupuestal"
                            readonly />
                    </div>
                    <div class="form-field">
                        <label for="email">Correo electrónico</label>
                        <input type="email" v-model="form.email" required />
                    </div>
                    <div class="form-field">
                        <label for="password">Contraseña</label>
                        <div class="input-wrapper">
                            <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required />
                            <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
                                @click="showPassword = !showPassword"></i>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-field" style="margin-bottom: 15px;">
                        <label for="confirm_password">Confirmar Contraseña</label>
                        <div class="input-wrapper">
                            <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirm_password"
                                required />
                            <i :class="showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
                                @click="showConfirmPassword = !showConfirmPassword"></i>
                        </div>
                    </div>
                    <!-- Campo Doc -->
                    <div class="form-field">
                        <label for="identificacion">identificacion</label>
                        <div class="dropzone" @drop.prevent="handleDrop('identificacion')" @dragover.prevent
                            @click="triggerFileInput('identificacion')">
                            <input type="file" id="identificacion" ref="fileInputDoc"
                                @change="handleFileUpload('identificacion')" accept=".pdf" multiple />
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span v-if="form.identificacion.length === 0">Arrastra o selecciona archivos (PDF)</span>
                            <span v-else>{{ form.identificacion.length }} archivos seleccionados</span>
                            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                        </div>

                        <button type="button" v-if="form.identificacion.length > 0" @click="openDocumentModal"
                            class="view-documents-btn">
                            Ver identificacion
                        </button>
                    </div>

                    <!-- Campo Foto -->
                    <div class="form-field">
                        <label for="imagen">Foto</label>
                        <div class="dropzone" @drop.prevent="handleDrop('Foto')" @dragover.prevent
                            @click="triggerFileInput('Foto')">
                            <input type="file" id="imagen" ref="fileInputFoto" @change="handleFileUpload('Foto')"
                                accept=".jpg,.png" />
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span v-if="!form.imagen">Arrastra o selecciona una imagen (JPG, PNG)</span>
                            <span v-else>{{ form.imagen.name }}</span>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="boton" type="submit">
                        <i class="fas fa-user"></i> Registrar
                    </button>
                </div>
            </form>
        </div>
        <div v-if="showAlertModal" class="modal">
            <div class="modal-content">
                <h2>¡Error!</h2>
                <ul>
                    <li v-for="(message, index) in alertMessageList" :key="index">{{ message }}</li>
                </ul>
                <button @click="closeAlertModal">Aceptar</button>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <h2>Usuario registrado con éxito.</h2>
                <button @click="closeModal">Aceptar</button>
            </div>
        </div>


        <!-- Modal para mostrar los identificacion cargados -->
        <div v-if="showDocumentModal" class="modal-overlay2">
            <div class="modal2">
                <h2>identificacion Cargados</h2>
                <div class="document-list2">
                    <div v-for="(doc, index) in form.identificacion" :key="index" class="document-item2">
                        <span>{{ doc.name }}</span>
                        <button @click="removeDocument(index)" class="remove-btn2">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                <button @click="closeDocumentModal">Cerrar</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "RegisterPage",
    data() {
        return {
            userName: "Cargando...", // Mensaje temporal
            form: {
                rol: "",
                nombre: "",
                apellidos: "",
                RFC: "",
                numero_trabajador: "",
                CURP: "",
                direccion_pertenencia: "",
                departamento: "",
                organo_superior: "Organismos Descentralizados",
                area_presupuestal: "RADIO Y TELEVISION DE HIDALGO",
                email: "",
                password: "",
                confirm_password: "",
                identificacion: [], // Almacena el archivo INE
                imagen: null, // Almacena el archivo Foto
            },
            showPassword: false,
            showConfirmPassword: false,
            menus: {
                homeMenu: false,
                usersMenu: false,
                settingsMenu: false,
            },
            showModal: false,
            showAlertModal: false,
            alertMessageList: [],
        };
    },
    mounted() {
        this.loadUserName();
    },
    methods: {
        loadUserName() {
            const storedUserName = localStorage.getItem("userName");
            this.userName = storedUserName ? storedUserName : "Usuario desconocido";
        },
        goHome() {
            this.$router.push('home');
        },
        registerUser() {
            let errorMessages = [];

            // Validar que las contraseñas coincidan
            if (this.form.password !== this.form.confirm_password) {
                errorMessages.push("Las contraseñas no coinciden.");
            }

            // Validar campos obligatorios
            const requiredFields = [
                "rol", "numero_trabajador", "nombre", "apellidos", "password",
                "confirm_password", "departamento", "email", "RFC", "CURP",
                "direccion_pertenencia", "organo_superior", "area_presupuestal",
            ];

            let hasErrors = false;
            requiredFields.forEach(field => {
                if (!this.form[field] || this.form[field] === "") {
                    hasErrors = true;
                    console.error(`El campo ${field} está vacío`);
                }
            });

            if (hasErrors) {
                this.alertMessageList = ["Todos los campos son obligatorios."];
                this.showAlertModal = true;
                return;
            }

            // Crear un objeto FormData
            const formData = new FormData();

            // Agregar campos del formulario
            formData.append('rol', this.form.rol);
            formData.append('numero_trabajador', this.form.numero_trabajador);
            formData.append('nombre', this.form.nombre);
            formData.append('apellidos', this.form.apellidos);
            formData.append('password', this.form.password);
            formData.append('confirm_password', this.form.confirm_password);
            formData.append('departamento', this.form.departamento);
            formData.append('email', this.form.email);
            formData.append('RFC', this.form.RFC.toUpperCase());
            formData.append('CURP', this.form.CURP.toUpperCase());
            formData.append('direccion_pertenencia', this.form.direccion_pertenencia);
            formData.append('organo_superior', this.form.organo_superior);
            formData.append('area_presupuestal', this.form.area_presupuestal);
            formData.append('fecha_registro', new Date().toISOString().split("T")[0]);

            // Agregar archivos de identificación (PDFs)
            if (this.form.identificacion.length > 0) {
                this.form.identificacion.forEach((file) => { // Eliminamos 'index' porque no se usa
                    formData.append('identificacion', file); // Nombre del campo: 'identificacion'
                });
            }

            // Agregar archivo de imagen (JPG/PNG)
            if (this.form.imagen) {
                formData.append('imagen', this.form.imagen); // Nombre del campo: 'imagen'
            }

            // Enviar los datos a la API
            axios.post('http://localhost:3000/api/usuarios', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Importante para enviar archivos
                }
            })
                .then(response => {
                    console.log('Usuario registrado con éxito', response.data);
                    this.showModal = true;
                })
                .catch(error => {
                    console.error('Error al registrar usuario', error.response?.data || error);
                    this.alertMessageList = ['Error al registrar usuario. Intenta de nuevo.'];
                    this.showAlertModal = true;
                });
        },

        navigateTo(page) {
            this.$router.push({ name: page });
        },
        showMenu(menu) {
            this.menus[menu] = true;
        },
        hideMenu(menu) {
            this.menus[menu] = false;
        },
        closeModal() {
            this.showModal = false;
            this.$router.push("/users");
        },
        closeAlertModal() {
            this.showAlertModal = false;
        },
        validateForm() {
            for (let key in this.form) {
                if (this.form[key] === "" || this.form[key] === null) {
                    return false;
                }
            }
            return true;
        },
        openDocumentModal() {
            this.showDocumentModal = true;
            this.$forceUpdate(); // Forzar la actualización
        },


        closeDocumentModal() {
            this.showDocumentModal = false;
            this.$forceUpdate();  // Asegura que la vista se actualice correctamente
        },
        triggerFileInput(type) {
            if (type === "identificacion") {
                this.$refs.fileInputDoc.click();
            } else if (type === "Foto") {
                this.$refs.fileInputFoto.click();
            }
        },
        handleFileUpload(type) {
            if (type === "identificacion") {
                const input = this.$refs.fileInputDoc;
                const files = Array.from(input.files); // Convierte FileList a un array

                // Validar el límite de 7 archivos
                if (files.length + this.form.identificacion.length > 7) {
                    this.errorMessage = "Solo puedes cargar un máximo de 7 archivos.";
                    return;
                }

                // Agregar los archivos al array
                this.form.identificacion = [...this.form.identificacion, ...files];
                this.errorMessage = ""; // Limpiar el mensaje de error
            } else if (type === "Foto") {
                this.form.imagen = this.$refs.fileInputFoto.files[0];
            }
        },

        // Método para eliminar un documento
        removeDocument(index) {
            this.form.identificacion.splice(index, 1); // Elimina el documento del array
        },

    },
};
</script>

<style scoped>
/* Aplicar Montserrat a todo el contenido */
* {
    font-family: 'Montserrat', sans-serif;
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
    width: 1150px;
    height: 375px;
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