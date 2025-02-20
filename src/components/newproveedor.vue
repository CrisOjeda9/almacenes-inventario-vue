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
                <h1>Nuevo Proveedor</h1>
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

        <!-- Formulario -->
        <div class="form-container">
            <form @submit.prevent="registerProveedor">
                <div class="form-row">
                    <!-- Nombre -->
                    <div class="form-field">
                        <label for="nombre">Nombre</label>
                        <input type="text" id="nombre" placeholder="" v-model="form.nombre" required />
                    </div>

                    <!-- Apellidos -->
                    <div class="form-field">
                        <label for="apellidos">Apellidos</label>
                        <input type="text" id="apellidos" placeholder="" v-model="form.apellidos"
                            required />
                    </div>

                    <!-- Tipo de Proveedor -->
                    <div class="form-field">
                        <label for="tipoProveedor">Tipo de proveedor</label>
                        <select id="tipoProveedor" v-model="form.tipoProveedor" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="fisico">Físico</option>
                            <option value="moral">Moral</option>
                        </select>
                    </div>

                    <!-- RFC -->
                    <div class="form-field">
                        <label for="rfc">RFC</label>
                        <input type="text" placeholder="" minlength="13" maxlength="13" v-model="form.rfc"
                            style="text-transform: uppercase;" required />
                    </div>
                </div>

                <div class="form-row">
                    <!-- Dirección -->
                    <div class="form-field">
                        <label for="direccion">Dirección</label>
                        <input type="text" id="direccion" placeholder=""
                            v-model="form.direccion" required />
                    </div>

                    <!-- Correo Electrónico -->
                    <div class="form-field">
                        <label for="correo">Correo electrónico</label>
                        <input type="email" id="correo" placeholder="" v-model="form.correo"
                            required />
                    </div>

                    <!-- Cuenta Bancaria -->
                    <div class="form-field">
                        <label for="cuentaBancaria">Cuenta bancaria</label>
                        <input type="text" id="cuentaBancaria" placeholder=""
                            v-model="form.cuentaBancaria" required />
                    </div>
                </div>

                <div class="form-row">
                    <!-- Documento relacionado -->
                    <div class="form-field">
                        <label for="documentos">Documentos</label>
                        <div class="dropzone" @drop.prevent="handleDrop('documentos')" @dragover.prevent
                            @click="triggerFileInput('documentos')">
                            <input type="file" id="documentos" ref="fileInputDoc"
                                @change="handleFileUpload('documentos')" accept=".pdf" multiple />
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span v-if="form.documentos.length === 0">Arrastra o selecciona archivos (PDF)</span>
                            <span v-else>{{ form.documentos.length }} archivos seleccionados</span>
                            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                        </div>

                        <button v-if="form.documentos.length > 0" @click.prevent="openDocumentModal"
                            class="view-documents-btn">
                            Ver Documentos
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
                <h2>Proveedor registrado con éxito</h2>
                <button @click="closeModal">Aceptar</button>
            </div>
        </div>
        <!-- Modal para mostrar los documentos cargados -->
        <div v-if="showDocumentModal" class="modal-overlay2">
            <div class="modal2">
                <h2>Documentos Cargados</h2>
                <div class="document-list2">
                    <div v-for="(doc, index) in form.documentos" :key="index" class="document-item2">
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
export default {
    name: "newProveedorPage",
    data() {
        return {
            userName: "Cargando...", // Mensaje temporal
            form: {
                nombre: "",               // Nombre del proveedor
                apellidos: "",            // Apellidos del proveedor
                tipoProveedor: "",        // Tipo de proveedor (físico/moral)
                rfc: "",                  // RFC del proveedor
                direccion: "",            // Dirección
                correo: "",               // Correo electrónico
                cuentaBancaria: "",       // Cuenta bancaria
                documentos: [],           // Documentos relacionados (archivos)
            },
            menus: {
                homeMenu: false,
                proveedorMenu: false,
                settingsMenu: false,
            },
            showModal: false,
            showDocumentModal: false, // Controla la visibilidad del modal de documentos
            errorMessage: "", // Mensaje de error
            showAlertModal: false,
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
            this.$router.push('home'); // Redirige a la página principal ("/").
        },
        openDocumentModal() {
            this.showDocumentModal = true;
        },

        // Método para cerrar el modal de documentos
        closeDocumentModal() {
            this.showDocumentModal = false;
        },

        triggerFileInput(type) {
            if (type === "documentos") {
                this.$refs.fileInputDoc.click();
            }
        },
        handleFileUpload(type) {
            if (type === "documentos") {
                const input = this.$refs.fileInputDoc;
                const files = Array.from(input.files);
                if (files.length + this.form.documentos.length > 7) {
                    alert("Solo puedes cargar un máximo de 7 archivos.");
                    return;
                }
                this.form.documentos = [...this.form.documentos, ...files];
            }
        },

        // Método para eliminar un documento
        removeDocument(index) {
            this.form.documentos.splice(index, 1); // Elimina el documento del array
        },
        closeModal() {
            this.showModal = false;
            if (this.redirectOnClose) {
                this.$router.push("/proveedor"); 
            }
        },

        closeAlertModal() {
            this.showAlertModal = false; // Cierra el modal de alerta
        },
        registerProveedor() {
            // Valida los campos necesarios
            if (!this.form.nombre || !this.form.apellidos || !this.form.tipoProveedor || !this.form.rfc || !this.form.direccion || !this.form.correo || !this.form.cuentaBancaria) {
                alert("Por favor, completa todos los campos obligatorios.");
                return;
            }
            if (this.form.documentos.length === 0) {
                alert("Por favor, agrega al menos un documento relacionado.");
                return;
            }

            this.showModal = true;
             this.redirectOnClose = true;
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
    width: 900px;
    height: 280px;
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