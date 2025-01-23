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
                        <p>Random user xd</p>
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
                    <button @click="navigateTo('home')">Alta de bienes</button>
                    <button @click="navigateTo('home')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Mi resguardo</button>
                    <button @click="navigateTo('factura')">Asignar un bien</button>


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
                        <label for="nombre">Nombre(s)</label>
                        <input type="text" placeholder="" v-model="form.nombre" required />

                    </div>
                    <div class="form-field">
                        <label for="apellido">Apellidos</label>
                        <input type="text" placeholder="" v-model="form.apellidos" required />

                    </div>
                    <div class="form-field">
                        <label for="rfc">RFC</label>
                        <input type="text" placeholder="" minlength="13" maxlength="13" v-model="form.rfc"
                            style="text-transform: uppercase;" required />

                    </div>
                    <div class="form-field">
                        <label for="numtrabajador">Num. Trabajador</label>
                        <input type="number" placeholder="" min="0" v-model="form.numTrabajador" required />

                    </div>
                </div>
                <div class="form-row">

                    <div class="form-field">
                        <label for="curp">CURP</label>
                        <input type="text" placeholder="" minlength="18" maxlength="18" v-model="form.curp" required
                            style="text-transform: uppercase;" />
                    </div>

                    <div class="form-field">
                        <label for="pertenencia">Direc. Pertenencia</label>

                        <select v-model="form.direccion" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="direccion_general">Dirección General</option>
                            <option value="direccion_coordinacion_financiera">Dirección de coordinación financiera y
                                planeación</option>
                            <option value="direccion_television">Dirección de televisión</option>
                            <option value="direccion_noticias">Dirección de noticias</option>
                            <option value="direccion_radio">Dirección de radio</option>
                            <option value="direccion_ingenieria">Dirección de ingeniería</option>
                            <option value="direccion_proyectos_estrategicos">Dirección de proyectos estratégicos
                            </option>
                            <option value="organo_interno_control">Órgano interno de control</option>
                            <option value="direccion_promocion_intercambio">Dirección de promoción e intercambio
                            </option>
                            <option value="direccion_juridica">Dirección jurídica</option>
                            <option value="direccion_vinculacion">Dirección de vinculación</option>
                            <option value="estaciones_radio">Estaciones de radio</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label for="departamento">Departamento</label>
                        <input type="text" placeholder="" v-model="form.departamento" required />

                    </div>
                    <div class="form-field">
                        <label for="organosuperior">Organo Superior</label>
                        <input type="text" placeholder="" v-model="form.organosuperior" required />

                    </div>

                </div>
                <div class="form-row">
                    <div class="form-field">
                        <label for="areapresupuestal">Área Presupuestal</label>
                        <input type="text" value="Radio y Televisión de Hidalgo"
                            placeholder="Radio y Televisión de Hidalgo" v-model="form.areapresupuestal" readonly />
                    </div>
                    <div class="form-field">
                        <label for="email">Email</label>
                        <input type="email" v-model="form.email" />
                    </div>
                    <div class="form-field">
                        <label for="password">Contraseña</label>
                        <div class="input-wrapper">
                            <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required />
                            <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
                                @click="showPassword = !showPassword"></i>
                        </div>
                    </div>

                    <div class="form-field">
                        <label for="confirmPassword" style="font-size: 11px;">Confirmar Contraseña</label>
                        <div class="input-wrapper">
                            <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword"
                                required />
                            <i :class="showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
                                @click="showConfirmPassword = !showConfirmPassword"></i>
                        </div>
                    </div>

                </div>


                <div class="form-row">
                    <!-- Campo INE -->
                    <div class="form-field">
                        <label for="documentoINE">INE</label>
                        <div class="dropzone" @drop.prevent="handleDrop('INE')" @dragover.prevent
                            @click="triggerFileInput('INE')">
                            <input type="file" id="documentoINE" ref="fileInputINE" @change="handleFileUpload('INE')"
                                accept=".pdf,.jpg,.png" />
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span v-if="!form.documentoINE">Arrastra o selecciona un archivo (PDF, JPG, PNG)</span>
                            <span v-else>{{ form.documentoINE.name }}</span>
                        </div>
                    </div>

                    <!-- Campo Foto -->
                    <div class="form-field">
                        <label for="documentoFoto">Foto</label>
                        <div class="dropzone" @drop.prevent="handleDrop('Foto')" @dragover.prevent
                            @click="triggerFileInput('Foto')">
                            <input type="file" id="documentoFoto" ref="fileInputFoto" @change="handleFileUpload('Foto')"
                                accept=".jpg,.png" />
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span v-if="!form.documentoFoto">Arrastra o selecciona un archivo (JPG, PNG)</span>
                            <span v-else>{{ form.documentoFoto.name }}</span>
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
    </div>
</template>

<script>
export default {
    name: "RegisterPage",
    data() {
        return {
            form: {
                nombre: "",
                apellidos: "",
                rfc: "",
                numTrabajador: "",
                curp: "",
                direccion: "",
                departamento: "",
                areapresupuestal: "",
                email: "",
                password: "",
                confirmPassword: "",
                documentoINE: null, // Almacena el archivo INE
                documentoFoto: null, // Almacena el archivo Foto
            },
            showPassword: false,
            showConfirmPassword: false,
            menus: {
                homeMenu: false,
                usersMenu: false,
                settingsMenu: false,
            },
        };
    },
    methods: {
        goHome() {
            this.$router.push('home'); // Redirige a la página principal ("/"). Cambia el path si es necesario.
        },
        goBack() {
            console.log("Regresar a la página anterior");
        },
        registerUser() {
            if (this.form.password !== this.form.confirmPassword) {
                alert("Las contraseñas no coinciden");
                return;
            }
            console.log("Usuario registrado:", this.form);
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
        triggerFileInput(type) {
            if (type === "INE") this.$refs.fileInputINE.click();
            if (type === "Foto") this.$refs.fileInputFoto.click();
        },
        handleFileUpload(type) {
            const input = type === "INE" ? this.$refs.fileInputINE : this.$refs.fileInputFoto;
            const file = input.files[0];
            if (file) {
                if (type === "INE") this.form.documentoINE = file;
                if (type === "Foto") this.form.documentoFoto = file;
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
    z-index: 10;
    /* Añadido para asegurarse de que el menú esté por encima de otros elementos */
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
    border-radius: 10px;
    width: 800px;
    height: 450px;
    max-width: 800px;
    color: black;
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
</style>