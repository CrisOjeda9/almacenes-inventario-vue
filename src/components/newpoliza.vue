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
                <h1>Nueva Poliza</h1>
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
                    <button @click="navigateTo('home')">Alta de bienes</button>
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Mi resguardo</button>
                    <button @click="navigateTo('factura')">Asignar un bien</button>


                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('polizaMenu')" @mouseleave="hideMenu('polizaMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.polizaMenu">
                    <button @click="navigateTo('users')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('users')">Salida de existencias</button>
                    <button @click="navigateTo('existencia')">Entrada de existencias</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('poliza')" style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Polizas</button>
                </div>
            </div>
        </div>

        <!-- Formulario -->
        <div class="form-container">
            <form @submit.prevent="registerPoliza">
                <div class="form-row">
                    <!-- Descripción -->
                    <div class="form-field">
                        <label for="descripcion">Descripción</label>
                        <input type="text" id="descripcion" placeholder="Ej. Póliza de seguro"
                            v-model="form.descripcion" required />
                    </div>

                    <!-- Cobertura -->
                    <div class="form-field">
                        <label for="cobertura">Cobertura</label>
                        <input type="text" id="cobertura" placeholder="Ej. Total" v-model="form.cobertura" required />
                    </div>

                    <!-- Tipo de Póliza -->
                    <div class="form-field">
                        <label for="tipopoliza">Tipo de Póliza</label>
                        <input type="text" id="tipopoliza" placeholder="Ej. Póliza de vida" v-model="form.tipopoliza"
                            required />
                    </div>

                    <!-- Calidad -->
                    <div class="form-field">
                        <label for="calidad">Calidad</label>
                        <input type="text" id="calidad" placeholder="Ej. Premium" v-model="form.calidad" required />
                    </div>
                </div>

                <div class="form-row">
                    <!-- Deducible -->
                    <div class="form-field">
                        <label for="deducible">Deducible</label>
                        <input type="number" step="0.01" id="deducible" placeholder="Ej. 5000" v-model="form.deducible"
                            min="0" required />
                    </div>

                    <!-- Limite de indemnización -->
                    <div class="form-field">
                        <label for="indemnizacion">Límite de indemnización</label>
                        <input type="number" step="0.01" id="indemnizacion" placeholder="Ej. 100000"
                            v-model="form.indemnizacion" min="0" required />
                    </div>

                    <!-- Periodo de Validación -->
                    <div class="form-field">
                        <label for="validacion">Periodo de Validación</label>
                        <input type="number" min="0" id="validacion" placeholder="Ej. 1 año" v-model="form.validacion"
                            required />
                    </div>

                    <!-- Clausulas de Exclusion -->
                    <div class="form-field">
                        <label for="exclusion">Cláusulas de Exclusion</label>
                        <input type="text" id="exclusion" placeholder="Ej. No aplica en caso de... "
                            v-model="form.exclusion" required />
                    </div>
                </div>

                <div class="form-row">
                    <!-- Fecha de Póliza -->
                    <div class="form-field">
                        <label for="fechapoliza">Fecha de Póliza</label>
                        <input type="date" id="fechapoliza" v-model="form.fechapoliza" required />
                    </div>

                    <!-- Fecha de Registro -->
                    <div class="form-field">
                        <label for="registrationDate">Fecha de Registro</label>
                        <input type="date" id="registrationDate" v-model="form.registrationDate" required />
                    </div>

                    <!-- Documento de Poliza -->
                    <div class="form-field">
                        <label for="documentopoliza">Documento de Poliza</label>
                        <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent @click="triggerFileInput">
                            <input type="file" id="documentopoliza" ref="fileInput" @change="handleFileUpload"
                                accept=".pdf,.jpg,.png" />
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span v-if="!form.documentopoliza">Arrastra o selecciona un archivo (PDF)</span>
                            <span v-else>{{ form.documentopoliza.name }}</span>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="boton" type="submit">
                        <i class="fas fa-plus"></i> Agregar Póliza
                    </button>
                </div>
            </form>
        </div>

    </div>
</template>

<script>
export default {
    name: "newPolizaPage",
    data() {
        return {
            form: {
                numfactura: "",           // No. Factura
                tipoCompra: "", // Asegúrate de que esté vacío por defecto
                concepto: "",             // Concepto
                fechafactura: "",         // Fecha de Factura
                proveedor: "",            // Proveedor
                cantidad: 0,              // Cantidad
                preciounitario: 0.0,      // Precio Unitario
                preciosiniva: 0.0,        // Precio total sin IVA
                iva: 0.0,                 // IVA
                precioconiva: 0.0,        // Precio total con IVA
                documentopoliza: null, // Almacena el archivo seleccionado
            },

            showPassword: false,
            showConfirmPassword: false,
            menus: {
                homeMenu: false,
                polizaMenu: false,
                settingsMenu: false,
            },
        };
    },
    methods: {
        goHome() {
            this.$router.push('home'); // Redirige a la página principal ("/"). Cambia el path si es necesario.
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.form.documentopoliza = file; // Almacena el archivo en el formulario
        },
        handleDrop(event) {
            const file = event.dataTransfer.files[0];
            this.form.documentopoliza = file; // Almacena el archivo en el formulario
        },
        triggerFileInput() {
            this.$refs.fileInput.click(); // Trigger el input file cuando se hace click en la dropzone
        },
        goBack() {
            console.log("Regresar a la página anterior");
        },
        registerPoliza() {
            if (this.form.password !== this.form.confirmPassword) {
                alert("Las contraseñas no coinciden");
                return;
            }
            console.log("Poliza registrada:", this.form);
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
    width: 1000px;
    height: 300px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.form-row {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
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