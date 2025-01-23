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
                </div>
                <div class="form-row">
                    <div class="form-field">
                        <label for="numtrabajador">Num. Trabajador</label>
                        <input type="number" placeholder="" min="0" v-model="form.numTrabajador" required />

                    </div>
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


                </div>
                <div class="form-row">
                    <div class="form-field">
                        <label for="departamento">Departamento</label>
                        <input type="text" placeholder="" v-model="form.departamento" required />

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
                        <label for="confirmPassword">Confirmar Contraseña</label>
                        <div class="input-wrapper">
                            <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword"
                                required />
                            <i :class="showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
                                @click="showConfirmPassword = !showConfirmPassword"></i>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="boton" type="submit">Registrar</button>
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
                password: "",
                confirmPassword: "",
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
    height: 350px;
    max-width: 800px;
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
    /* Asegura que tenga la misma altura que los inputs */
}
</style>