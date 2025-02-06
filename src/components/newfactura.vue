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
                <h1>Nueva Factura</h1>
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
                    <button @click="navigateTo('historialbienes')">Historial de bienes</button>
                    <button @click="navigateTo('home')">Alta de bienes</button>
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Mi resguardo</button>
                    <button @click="navigateTo('listaalmacen')">Lista Almacén para asignar No.Inventario</button>
                    <button @click="navigateTo('')">Lista Bienes con No.Inventario para asignar Usuario</button>
                    <button @click="navigateTo('reportes')">Generación de Formatos/Reportes</button>
                    <button @click="navigateTo('bienesnuevos')">Bienes nuevos para asignar resguardo</button>


                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('facturaMenu')" @mouseleave="hideMenu('facturaMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.facturaMenu">
                    <button @click="navigateTo('solicitudmaterial')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('users')">Salida de existencias</button>
                    <button @click="navigateTo('existencia')">Entrada de existencias</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')"
                        style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Facturas</button>
                    <button @click="navigateTo('poliza')">Polizas</button>
                </div>
            </div>
        </div>

        <!-- Formulario -->
        <div class="form-container">
            <form @submit.prevent="registerFactura">
                <div class="form-row">
                    <!-- Tipo de alta -->
                    <div class="form-field">
                        <label for="tipoAlta">Tipo de alta</label>
                        <select id="tipoAlta" v-model="form.tipoAlta" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="compra">Compra (CM)</option>
                            <option value="donacion">Donacion (DN)</option>
                            <option value="comodato">Comodato (CO)</option>
                        </select>
                    </div>
                    <!-- Tipo de alta -->
                    <div class="form-field">
                        <label for="tipoDocumentoAmpara">Tipo de doc. que ampara</label>
                        <select id="tipoDocumentoAmpara" v-model="form.tipoDocumentoAmpara" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="contrato">Contrato de Comodato (CO)</option>
                            <option value="cd">CD</option>
                            <option value="conprobante">Comprobante Fiscal Digital por Internet (CFDI)</option>
                        </select>
                    </div>
                    <!-- Fecha de aduisicion -->
                    <div class="form-field">
                        <label for="fechaAdquisicion">Fecha de Adquisición</label>
                        <input type="date" id="fechaAdquisicion" v-model="form.fechaAdquisicion" required />
                    </div>
                    <!-- No. Factura -->
                    <div class="form-field">
                        <label for="numfactura">No. Factura</label>
                        <input type="number" min="0" id="numfactura" placeholder="Ej. F123456" v-model="form.numFactura"
                            required />
                    </div>






                </div>

                <div class="form-row">
                    <!-- Tipo de Compra -->
                    <div class="form-field">
                        <label for="tipoCompra">Tipo de compra</label>
                        <select id="tipoCompra" v-model="form.tipoCompra" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="estatal">Estatal</option>
                            <option value="presupuestal">Presupuestal</option>
                        </select>
                    </div>
                    <!-- Concepto -->
                    <div class="form-field">
                        <label for="concepto">Concepto</label>
                        <input type="text" id="concepto" placeholder="Ej. Compra de material" v-model="form.concepto"
                            minlength="3" maxlength="100" style="text-transform: uppercase;" required />
                    </div>
                    <!-- Fecha de Factura -->
                    <div class="form-field">
                        <label for="fechaFactura">Fecha de Factura</label>
                        <input type="date" id="fechaFactura" v-model="form.fechaFactura" required />
                    </div>
                    <!-- Cantidad -->
                    <div class="form-field">
                        <label for="cantidad">Cantidad</label>
                        <input type="number" min="0" id="cantidad" placeholder="Ej. 100" v-model="form.cantidad"
                            required />
                    </div>

                </div>

                <div class="form-row">



                    <!-- Precio Unitario -->
                    <div class="form-field">
                        <label for="precioUnitario">Precio Unitario</label>
                        <input type="number" id="precioUnitario" step="0.01" placeholder="Ej. 50.00"
                            v-model="form.precioUnitario" min="0" required />
                    </div>
                    <!-- Precio Total sin IVA -->
                    <div class="form-field">
                        <label for="precioTotalSinIVA">Precio total sin IVA</label>
                        <input type="number" id="precioTotalSinIVA" step="0.01" placeholder="Ej. 5000.00"
                            v-model="form.precioTotalSinIVA" min="0" required />
                    </div>
                    <!-- IVA -->
                    <div class="form-field">
                        <label for="iva">IVA</label>
                        <input type="number" id="iva" step="0.01" placeholder="Ej. 800.00" v-model="form.iva" min="0"
                            required />
                    </div>
                    <!-- Precio Total con IVA -->
                    <div class="form-field">
                        <label for="precioTotalConIVA">Precio total con IVA</label>
                        <input type="number" id="precioTotalConIVA" step="0.01" placeholder="Ej. 5800.00"
                            v-model="form.precioTotalConIVA" min="0" required />
                    </div>

                </div>

                <div class="form-row">
                    <!-- Proveedor -->
                    <div class="form-field">
                        <label for="proveedor">Proveedor</label>
                        <select id="proveedor" v-model="form.proveedor" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="carlos">Carlos Martin Hernandez de Jesus</option>
                            <option value="carlos">Myriam Valderrabano Cortes</option>
                            <option value="carlos">Cristian Eduardo Ojeda Gayosso</option>
                        </select>
                    </div>
                    <!-- Documento de Factura -->
                    <div class="form-field">
                        <label for="documentofactura">Documento de Factura</label>
                        <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent @click="triggerFileInput">
                            <input type="file" id="documentofactura" ref="fileInput" @change="handleFileUpload"
                                accept=".pdf,.jpg,.png" />
                            <span v-if="!form.documentofactura">Arrastra o selecciona un archivo (PDF)</span>
                            <span v-else>{{ form.documentofactura.name }}</span>
                        </div>
                    </div>
                </div>

                <div class="button-container">
                    <button class="boton" type="submit">
                        <i class="fas fa-plus"></i> Agregar Factura
                    </button>
                </div>
            </form>
        </div>

    </div>
</template>

<script>
export default {
    name: "newFacturaPage",
    data() {
        return {
            form: {
                tipoAlta: "", // Asegúrate de que esté vacío por defecto
                tipoDocumentoAmpara: "", // Asegúrate de que esté vacío por defecto
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
                documentofactura: null, // Almacena el archivo seleccionado
            },

            showPassword: false,
            showConfirmPassword: false,
            menus: {
                homeMenu: false,
                facturaMenu: false,
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
            this.form.documentofactura = file; // Almacena el archivo en el formulario
        },
        handleDrop(event) {
            const file = event.dataTransfer.files[0];
            this.form.documentofactura = file; // Almacena el archivo en el formulario
        },
        triggerFileInput() {
            this.$refs.fileInput.click(); // Trigger el input file cuando se hace click en la dropzone
        },
        goBack() {
            console.log("Regresar a la página anterior");
        },
        registerFactura() {
            if (this.form.password !== this.form.confirmPassword) {
                alert("Las contraseñas no coinciden");
                return;
            }
            console.log("Factura registrada:", this.form);
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
    width: 1150px;
    height: 375px;
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