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
                    <button @click="navigateTo('')">Historial de bienes</button>
                    <button @click="navigateTo('home')">Alta de bienes</button>
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Mi resguardo</button>
                    <button @click="navigateTo('listaalmacen')">Lista Almacén para asignar No.Inventario</button>
                    <button @click="navigateTo('')">Lista Bienes con No.Inventario para asignar Usuario</button>
                    <button @click="navigateTo('')">Generación de Formatos/Reportes</button>
                    <button @click="navigateTo('bienesnuevos')">Bienes nuevos para asignar resguardo</button>


                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('proveedorMenu')" @mouseleave="hideMenu('proveedorMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.proveedorMenu">
                    <button @click="navigateTo('users')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('users')">Salida de existencias</button>
                    <button @click="navigateTo('existencia')">Entrada de existencias</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')" style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Ver proveedores</button>
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
                <input type="text" id="nombre" placeholder="Ej. Juan" v-model="form.nombre" required />
            </div>

            <!-- Apellidos -->
            <div class="form-field">
                <label for="apellidos">Apellidos</label>
                <input type="text" id="apellidos" placeholder="Ej. Pérez López" v-model="form.apellidos" required />
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
                <input type="text" id="rfc" placeholder="Ej. ABC1234567Z9" v-model="form.rfc" required />
            </div>
        </div>

        <div class="form-row">
            <!-- Dirección -->
            <div class="form-field">
                <label for="direccion">Dirección</label>
                <input type="text" id="direccion" placeholder="Ej. Calle 123, Ciudad, Estado" v-model="form.direccion" required />
            </div>

            <!-- Correo Electrónico -->
            <div class="form-field">
                <label for="correo">Correo electrónico</label>
                <input type="email" id="correo" placeholder="Ej. ejemplo@correo.com" v-model="form.correo" required />
            </div>

            <!-- Cuenta Bancaria -->
            <div class="form-field">
                <label for="cuentaBancaria">Cuenta bancaria</label>
                <input type="text" id="cuentaBancaria" placeholder="Ej. 1234567890123456" v-model="form.cuentaBancaria" required />
            </div>
        </div>

        <div class="form-row">
            <!-- Documento relacionado -->
            <div class="form-field">
                <label for="documentoProveedor">Documento de acuerdo al proveedor</label>
                <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent @click="triggerFileInput">
                    <input type="file" id="documentoProveedor" ref="fileInput" @change="handleFileUpload" accept=".pdf,.jpg,.png" />
                    <i class="fas fa-cloud-upload-alt"></i>
                    <span v-if="!form.documentoProveedor">Arrastra o selecciona un archivo (PDF, JPG, PNG)</span>
                    <span v-else>{{ form.documentoProveedor.name }}</span>
                </div>
            </div>
        </div>

        <div class="button-container">
            <button class="boton" type="submit">
                <i class="fas fa-plus"></i> Agregar Proveedor
            </button>
        </div>
    </form>
</div>


    </div>
</template>

<script>
export default {
    name: "newProveedorPage",
    data() {
        return {
            form: {
                nombre: "",               // Nombre del proveedor
                apellidos: "",            // Apellidos del proveedor
                tipoProveedor: "",        // Tipo de proveedor (físico/moral)
                rfc: "",                  // RFC del proveedor
                direccion: "",            // Dirección
                correo: "",               // Correo electrónico
                cuentaBancaria: "",       // Cuenta bancaria
                documentoProveedor: null, // Documento relacionado (archivo)
            },
            menus: {
                homeMenu: false,
                proveedorMenu: false,
                settingsMenu: false,
            },
        };
    },
    methods: {
        goHome() {
            this.$router.push('home'); // Redirige a la página principal ("/").
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.form.documentoProveedor = file; // Almacena el archivo en el formulario
        },
        handleDrop(event) {
            const file = event.dataTransfer.files[0];
            this.form.documentoProveedor = file; // Almacena el archivo en el formulario
        },
        triggerFileInput() {
            this.$refs.fileInput.click(); // Trigger del input file cuando se hace click en la dropzone
        },
        registerProveedor() {
            // Valida los campos necesarios
            if (!this.form.nombre || !this.form.apellidos || !this.form.tipoProveedor || !this.form.rfc || !this.form.direccion || !this.form.correo || !this.form.cuentaBancaria) {
                alert("Por favor, completa todos los campos obligatorios.");
                return;
            }
            if (!this.form.documentoProveedor) {
                alert("Por favor, agrega un documento relacionado.");
                return;
            }

            // Procesa el registro del proveedor
            console.log("Proveedor registrado:", this.form);
            alert("Proveedor registrado exitosamente.");
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
    width: 900px;
    height: 250px;
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