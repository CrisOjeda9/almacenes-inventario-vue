<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />

    <div class="container">
        <!-- Menú de navegación -->
        <nav class="navbar">
            <div class="navbar-left">
                <img src="../assets/LOGOS DORADOS-02.png" alt="Icono" class="navbar-icon" @click="goHome" width="50%"
                    height="auto" style="cursor: pointer;" />
            </div>
            <div class="navbar-center">
                <h1>Entrada de Existencias</h1>
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
                    <button @click="navigateTo('home')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Mi resguardo</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('poliza')">Polizas</button>


                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('usersMenu')" @mouseleave="hideMenu('usersMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.usersMenu">
                    <button @click="navigateTo('users')">Solicitud de material</button>
                    <button @click="navigateTo('users')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('users')">Salida de existencias</button>
                    <button @click="navigateTo('existencia')">Entrada de existencias</button>
                    <button @click="navigateTo('users')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                </div>
            </div>
        </div>

        <!-- Formulario -->
        <div class="form-container">
            <form @submit.prevent="registerProveedor">
                <div class="form-row">
                    <!-- ID -->
                    <div class="form-field">
                        <label for="id">ID</label>
                        <input type="number" min="0" id="id" placeholder="Ej. 1" v-model="form.id" required />
                    </div>

                    <!-- Número de factura -->
                    <div class="form-field">
                        <label for="numerofactura">Número de factura</label>
                        <input type="number" min="0" id="numerofactura" placeholder="Ej. 10"
                            v-model="form.numeroFactura" required />
                    </div>

                    <!-- Proveedor -->
                    <div class="form-field">
                        <label for="tipoProveedor">Proveedor</label>
                        <select id="tipoProveedor" v-model="form.proveedor" required>
                            <option value="">Selecciona una opción</option>
                            <option value="carlos">Carlos</option>
                            <option value="cristian">Cristian</option>
                        </select>
                    </div>

                    <!-- Número de partida -->
                    <div class="form-field">
                        <label for="numeroPartida">Número de partida</label>
                        <select id="numeroPartida" v-model="form.numeroPartida" required>
                            <option value="">Selecciona una opción</option>
                            <option value="fisico">Físico</option>
                            <option value="moral">Moral</option>
                        </select>
                    </div>
                </div>

                <div class="form-row">
                    <!-- Nombre -->
                    <div class="form-field">
                        <label for="nombre">Nombre</label>
                        <input type="text" id="nombre" placeholder="Ej. Nombre completo" v-model="form.nombre"
                            required />
                    </div>

                    <!-- Importe sin IVA -->
                    <div class="form-field">
                        <label for="importeSinIVA">Importe sin IVA</label>
                        <input type="number" step="0.01" id="importeSinIVA" placeholder="Ej. 1000.00"
                            v-model="form.importeSinIVA" required />
                    </div>

                    <!-- IVA -->
                    <div class="form-field">
                        <label for="iva">IVA</label>
                        <input type="number" step="0.01" id="iva" placeholder="Ej. 160.00" v-model="form.iva"
                            required />
                    </div>

                    <!-- Importe con IVA -->
                    <div class="form-field">
                        <label for="importeConIVA">Importe con IVA</label>
                        <input type="number" step="0.01" id="importeConIVA" placeholder="Ej. 1160.00"
                            v-model="form.importeConIVA" required />
                    </div>
                </div>

                <div class="form-row">
                    <!-- Cantidad -->
                    <div class="form-field">
                        <label for="cantidad">Cantidad</label>
                        <input type="number" min="0" id="cantidad" placeholder="Ej. 50" v-model="form.cantidad"
                            required />
                    </div>

                    <!-- Ubicación en almacén -->
                    <div class="form-field">
                        <label for="ubicacionAlmacen">Ubic. almacén</label>
                        <input type="text" id="ubicacionAlmacen" placeholder="Ej. Pasillo A3"
                            v-model="form.ubicacionAlmacen" required />
                    </div>

                    <!-- Total de ingreso -->
                    <div class="form-field">
                        <label for="totalIngreso">Total de ingreso</label>
                        <input type="number" step="0.01" id="totalIngreso" placeholder="Ej. 5000.00"
                            v-model="form.totalIngreso" required />
                    </div>

                    <!-- Foto artículo -->
                    <div class="form-field">
                        <label for="fotoArticulo">Foto artículo</label>
                        <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent @click="triggerFileInput">
                            <input type="file" id="fotoArticulo" ref="fileInput" @change="handleFileUpload"
                                accept=".pdf,.jpg,.png" />
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span v-if="!form.fotoArticulo">Arrastra o selecciona un archivo (PDF, JPG, PNG)</span>
                            <span v-else>{{ form.fotoArticulo.name }}</span>
                        </div>
                    </div>
                </div>

                <div class="button-container">
                    <button class="boton" type="submit">
                        <i class="fas fa-plus"></i> Agregar Existencia
                    </button>
                </div>
            </form>
        </div>



    </div>
</template>

<script>
export default {
    name: "newExistenciaPage",
    data() {
        return {
            form: {
                id: "",                     // ID del registro
                numeroFactura: "",          // Número de factura
                proveedor: "",              // Proveedor (Carlos/Cristian)
                numeroPartida: "",          // Número de partida (físico/moral)
                nombre: "",                 // Nombre del artículo
                importeSinIVA: "",          // Importe sin IVA
                iva: "",                    // IVA
                importeConIVA: "",          // Importe con IVA
                cantidad: "",               // Cantidad
                ubicacionAlmacen: "",       // Ubicación en almacén
                totalIngreso: "",           // Total de ingreso
                fotoArticulo: null          // Foto del artículo (archivo)
            },

            menus: {
                homeMenu: false,
                usersMenu: false,
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
            if (
                !this.form.id ||
                !this.form.numeroFactura ||
                !this.form.proveedor ||
                !this.form.numeroPartida ||
                !this.form.nombre ||
                !this.form.importeSinIVA ||
                !this.form.iva ||
                !this.form.importeConIVA ||
                !this.form.cantidad ||
                !this.form.ubicacionAlmacen ||
                !this.form.totalIngreso
            ) {
                alert("Por favor, completa todos los campos obligatorios.");
                return;
            }

            if (!this.form.fotoArticulo) {
                alert("Por favor, agrega una foto del artículo.");
                return;
            }

            // Procesa el registro
            console.log("Datos registrados:", this.form);
            alert("Datos registrados exitosamente.");
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
    width: 99vw;
    height: 97.5vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(to bottom, #000000, #691B31);
    color: white;
    overflow: hidden;
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
    position: relative;
    /* Asegura que z-index funcione */
    z-index: 10;
    /* Asegura que la barra de navegación esté por encima */
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
    z-index: 20;
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
    padding: 40px;
    padding-bottom: 80px;
    border-radius: 10px;
    width: 100%;
    height: 350px;
    max-width: 950px;
    color: black;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.form-row {
    display: flex;
    justify-content: center;
    margin-bottom: 25px;
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

.form-field {
    padding-left: 3%;
    padding-right: 6%;
}


a {
    text-decoration: none;
}



.form-field select {
    width: 100%;
    max-width: 200px;
    position: relative;
    font-size: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: white;
    color: #333;
    height: 40px;
    z-index: 1;
    /* Asegura que el select no esté encima de la barra de navegación */
    position: relative;
    /* Asegura que tenga la misma altura que los inputs */
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

select {
    z-index: 1;
    /* Aparece correctamente dentro del formulario */
    position: relative;
}
</style>