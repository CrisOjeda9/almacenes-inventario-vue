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
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Mi resguardo</button>
                    <button @click="navigateTo('factura')">Asignar un bien</button>


                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('existenciaMenu')" @mouseleave="hideMenu('existenciaMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.existenciaMenu">
                    <button @click="navigateTo('users')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('users')">Salida de existencias</button>
                    <button @click="navigateTo('existencia')"
                        style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Entrada de
                        existencias</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('poliza')">Polizas</button>
                </div>
            </div>
        </div>

        <!-- Formulario -->
        <div class="form-container">
            <form @submit.prevent="registerExistencia">
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



                    <!-- Número de partida -->
                    <div class="form-field">
                        <label for="numeroPartida">Número de partida</label>
                        <select id="numeroPartida" v-model="form.numeroPartida" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="fisico">Físico</option>
                            <option value="moral">Moral</option>
                        </select>
                    </div>
                    <!-- Nombre -->
                    <div class="form-field">
                        <label for="nombre">Nombre</label>
                        <input type="text" id="nombre" placeholder="Ej. Nombre completo" v-model="form.nombre"
                            required />
                    </div>
                </div>

                <div class="form-row">


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
                    <!-- Cantidad -->
                    <div class="form-field">
                        <label for="cantidad">Cantidad</label>
                        <input type="number" min="0" id="cantidad" placeholder="Ej. 50" v-model="form.cantidad"
                            required />
                    </div>
                </div>

                <div class="form-row">

                    <!-- Unidad de medida -->
                    <div class="form-field">
                        <label for="unidadmedida">Unidad de medida</label>
                        <select id="unidadmedida" v-model="form.unidadmedida" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="piezas">Piezas</option>
                            <option value="paquetes">Paquetes</option>
                            <option value="cajas">Cajas</option>
                            <option value="kilogramos">Kilogramos</option>
                            <option value="litros">Litros</option>
                            <option value="metros">Metros</option>
                            <option value="rollos">Rollos</option>
                            <option value="bultos">Bultos</option>
                        </select>
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


                </div>
                <div class="form-row">
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

                <div class="button-container" style="gap: 30px;">
                    <button class="boton" type="submit">
                        <i class="fas fa-plus"></i> Agregar Existencia
                    </button>
                    <button class="boton" type="button" @click="redirigirPagina">
                        <i class="fas fa-plus-square"></i> Agregar Bien
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
                numeroPartida: "",          // Número de partida (físico/moral)
                nombre: "",                 // Nombre del artículo
                importeSinIVA: "",          // Importe sin IVA
                iva: "",                    // IVA
                importeConIVA: "",          // Importe con IVA
                cantidad: "",
                unidadmedida: "",               // Cantidad
                ubicacionAlmacen: "",       // Ubicación en almacén
                totalIngreso: "",           // Total de ingreso
                fotoArticulo: null          // Foto del artículo (archivo)
            },

            menus: {
                homeMenu: false,
                existenciaMenu: false,
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
            this.form.documentoExistencia = file; // Almacena el archivo en el formulario
        },
        handleDrop(event) {
            const file = event.dataTransfer.files[0];
            this.form.documentoExistencia = file; // Almacena el archivo en el formulario
        },
        triggerFileInput() {
            this.$refs.fileInput.click(); // Trigger del input file cuando se hace click en la dropzone
        },
        registerExistencia() {
            // Valida los campos necesarios
            if (
                !this.form.id ||
                !this.form.numeroFactura ||
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
        redirigirPagina() {
            // Cambia 'ruta_deseada' por la URL a la que deseas redirigir
            window.location.href = 'bieninventario';
        }
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