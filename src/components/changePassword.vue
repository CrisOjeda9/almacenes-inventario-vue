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
                <h1>Nueva Contraseña</h1>
                <p>Sistema de Almacén e Inventarios de Radio y Televisión de Hidalgo</p>
            </div>
            <div class="navbar-right">
                <div class="user-profile">
                    <img :src="profileImage" alt="User Profile" class="profile-pic" />
                    <div class="user-info">
                        <p>{{ userName }}</p>
                        <span><a href="profile" style="color: white;">Ver Perfil</a></span>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Barra de navegación amarilla -->
        <div class="sub-navbar">
            <a href="/home" class="nav-item">Inicio</a>
            <a v-if="userRole === 'Administrador'" href="users" class="nav-item">Usuarios</a>
            <!-- Menú de Inventario para Administrador e Inventario (todas las opciones) -->
            <div v-if="userRole === 'Inventario' || userRole === 'Administrador'" class="nav-item"
                @mouseenter="showMenu('homeMenu')" @mouseleave="hideMenu('homeMenu')">
                Inventario
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.homeMenu">
                    <button @click="navigateTo('bajas')">Historial de bajas</button>
                    <button @click="navigateTo('historialbienes')">Historial de bienes</button>
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Bienes sin resguardo</button>
                    <button @click="navigateTo('listaalmacen')">Asignar No. Inventario</button>
                    <button @click="navigateTo('bienesnuevos')">Asignar resguardo</button>
                    <button @click="navigateTo('liberarbien')">Liberar Bien</button>
                    <button @click="navigateTo('reportes')">Generación de reportes</button>
                </div>
            </div>

            <!-- Menú SOLO para Usuario (solo "Bienes sin resguardo") -->
            <div v-if="userRole === 'Usuario'" class="nav-item" @mouseenter="showMenu('userMenu')"
                @mouseleave="hideMenu('userMenu')">
                Inventario
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.userMenu">
                    <button @click="navigateTo('resguardo')">Bienes sin resguardo</button>
                </div>
            </div>

            <div v-if="userRole === 'Almacenes' || userRole === 'Administrador'" class="nav-item"
                @mouseenter="showMenu('proveedorMenu')" @mouseleave="hideMenu('proveedorMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.proveedorMenu">
                    <button @click="navigateTo('solicitudmaterial')">Salida de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('existencia')">Entrada de artículos</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('poliza')">Polizas</button>
                </div>
            </div>
        </div>

        <!-- Formulario -->
        <div class="form-container">
            <form @submit.prevent="registerPassword">
                <div class="form-field">
                    <label for="actualpassword">Contraseña Actual</label>
                    <div class="input-wrapper">
                        <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required />
                        <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
                            @click="showPassword = !showPassword"></i>
                    </div>
                </div>
                <div class="form-field">
                    <label for="newpassword">Contraseña Nueva</label>
                    <div class="input-wrapper">
                        <input :type="shownewPassword ? 'text' : 'password'" v-model="form.newpassword"
                            @input="validateNewPassword" @blur="validateNewPassword" required />
                        <i :class="shownewPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
                            @click="shownewPassword = !shownewPassword"></i>
                    </div>
                    <span class="error-message" v-if="errors.newpassword">{{ errors.newpassword }}</span>
                </div>

                <div class="form-field">
                    <label for="confirmPassword">Confirmar Nueva Contraseña</label>
                    <div class="input-wrapper">
                        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword"
                            required />
                        <i :class="showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
                            @click="showConfirmPassword = !showConfirmPassword"></i>
                    </div>
                </div>
                <button class="boton" type="submit">Guardar</button>
            </form>
        </div>
        <!-- Contenedor de notificaciones -->
        <div v-if="alertMessage" :class="alertClass" class="notification">
            <i :class="alertIcon"></i> {{ alertMessage }}
        </div>
    </div>
</template>

<script>
export default {
    name: "changePassword",
    data() {
        return {
            alertMessage: "",
            alertClass: "",
            alertIcon: "",
            userName: "Cargando...",
            profileImage: "",
            form: {
                password: "",
                newpassword: "",
                confirmPassword: "",
            },
            errors: {
                newpassword: ""
            },
            showPassword: false,
            showConfirmPassword: false,
            shownewPassword: false,
            menus: {
                homeMenu: false,
                passwordMenu: false,
                settingsMenu: false,
            },
            userRole: localStorage.getItem('userRole') || '', // Obtener el rol desde el localStorage

        };
    },
    mounted() {
        this.loadUserData();
    },
    methods: {
        validateNewPassword() {
            if (!this.form.newpassword) {
                this.errors.newpassword = "Complete este campo";
                return false;
            }

            if (!/[A-Z]/.test(this.form.newpassword)) {
                this.errors.newpassword = "Falta una letra mayúscula";
                return false;
            }

            if (!/[a-z]/.test(this.form.newpassword)) {
                this.errors.newpassword = "Falta una letra minúscula";
                return false;
            }

            if (!/\d/.test(this.form.newpassword)) {
                this.errors.newpassword = "Falta un número";
                return false;
            }

            if (!/[@$!%*?&]/.test(this.form.newpassword)) {
                this.errors.newpassword = "Falta un carácter especial (@$!%*?&)";
                return false;
            }

            if (this.form.newpassword.length < 8 || this.form.newpassword.length > 16) {
                this.errors.newpassword = "Debe tener entre 8-16 caracteres";
                return false;
            }

            this.errors.newpassword = "";
            return true;
        },

        async loadUserData() {
            const storedUserName = localStorage.getItem("userName");
            const storedUserEmail = localStorage.getItem("userEmail");

            if (storedUserName && storedUserEmail) {
                this.userName = storedUserName;

                try {
                    const response = await fetch('http://localhost:3000/api/personas');
                    const users = await response.json();
                    const user = users.find(u => u.email === storedUserEmail);

                    if (user) {
                        const fullName = `${user.nombre || storedUserName} ${user.apellidos || ""}`.trim();
                        this.userName = fullName;
                        const imagePath = user.imagen;
                        let imageFileName = imagePath.split('\\').pop();

                        if (imageFileName) {
                            imageFileName = imageFileName.split('.').slice(0, -1).join('.');
                            this.profileImage = `http://localhost:3000/api/users-files/${imageFileName}`;
                        } else {
                            this.profileImage = "../assets/UserHombre.png";
                        }
                    } else {
                        this.profileImage = "../assets/UserHombre.png";
                    }
                } catch (error) {
                    console.error('Error al cargar los datos del usuario:', error);
                    this.profileImage = "../assets/UserHombre.png";
                }
            } else {
                this.userName = "Usuario desconocido";
                this.profileImage = "../assets/UserHombre.png";
            }
        },
        goHome() {
            this.$router.push('home');
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

            setTimeout(() => {
                this.alertMessage = "";
            }, 3000);
        },
        async registerPassword() {
            // Validar nueva contraseña primero
            if (!this.validateNewPassword()) {
                return;
            }

            // Validación original de coincidencia de contraseñas
            if (this.form.newpassword !== this.form.confirmPassword) {
                this.showAlert("Las contraseñas no coinciden", "error");
                return;
            }

            const email = localStorage.getItem("userEmail");
            try {
                const personasResponse = await fetch('http://localhost:3000/api/personas');
                const personas = await personasResponse.json();
                const persona = personas.find(p => p.email === email);

                if (!persona) {
                    this.showAlert("Usuario no encontrado en tb_personas", "error");
                    return;
                }

                const usersResponse = await fetch('http://localhost:3000/api/usuarios');
                const users = await usersResponse.json();
                const user = users.find(u => u.id_persona === persona.id);

                if (!user) {
                    this.showAlert("Usuario no encontrado en tb_usuarios", "error");
                    return;
                }

                if (this.form.password !== user.password) {
                    this.showAlert("La contraseña actual es incorrecta", "error");
                    return;
                }

                const updateResponse = await fetch(`http://localhost:3000/api/usuarios/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: this.form.newpassword,
                    }),
                });

                if (updateResponse.ok) {
                    this.showAlert('Contraseña actualizada exitosamente', 'success');
                    setTimeout(() => {
                        this.$router.push('/home');
                    }, 2000);
                } else {
                    const error = await updateResponse.json();
                    this.showAlert('Error al actualizar la contraseña: ' + (error.message || 'Error desconocido'), 'error');
                }

            } catch (error) {
                console.error('Error en el servidor:', error);
                this.showAlert('Error en el servidor: ' + error.message, 'error');
            }
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
    },
};
</script>




<style scoped>
/* Aplicar Montserrat a todo el contenido */
* {
    font-family: 'Montserrat', sans-serif;
}

.error-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
    display: block;
}

.input-wrapper {
    position: relative;
}

.input-wrapper i {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #666;
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

/* ------------------------------------------------------------------------------*/
.container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    background: white;
    flex-direction: column;
    color: white;
}

/* Menú de navegación */
.navbar {
    position: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 20px;
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
    font-size: 18px;
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
    z-index: 1000;
    /* Asegurar que esté encima */
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
    width: 500px;
    height: 350px;
    max-width: 800px;
    color: black;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

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
    padding-bottom: 30px;
    width: 80%;
}

a {
    text-decoration: none;
}
</style>