<template>
    <div class="page-wrapper">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        <NavBarPage :pageTitle="'Nuevo Usuario'" :showUserMenu="true" />
        <div class="container">
            <!-- Menú de navegación -->
            <nav class="navbar">
                <div class="navbar-left">
                    <img src="../assets/LOGOS DORADOS-02.png" alt="Icono" class="navbar-icon" @click="goHome" width="50%"
                        height="auto" style="cursor: pointer;" />
                </div>
                <div class="navbar-center">
                    <h1>Nuevo Usuario</h1>
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
                <a href="users" class="nav-item" style="color: #6F7271; ">Aministrador</a>
                

                <div class="nav-item" @mouseenter="showMenu('usersMenu')" @mouseleave="hideMenu('usersMenu')">
                    Almacen
                    <span class="menu-icon">▼</span>
                    <div class="dropdown-menu" v-show="menus.usersMenu">
                        <button @click="navigateTo('proveedor')">Ver proveedores</button>
                        <button @click="navigateTo('factura')">Facturas</button>
                        <button @click="navigateTo('existencia')">Entrada de artículos</button>
                        <button @click="navigateTo('articulos')">Existencias</button>
                        <button @click="navigateTo('solicitudmaterial')">Salida de material</button>
                        <button @click="navigateTo('recepcionsolicitudes')">Recepción de solicitudes</button>
                        <button @click="navigateTo('poliza')">Pólizas</button>
                    </div>
                </div>

                <div class="nav-item" @mouseenter="showMenu('homeMenu')" @mouseleave="hideMenu('homeMenu')">
                    Inventario
                    <span class="menu-icon">▼</span>
                    <div class="dropdown-menu" v-show="menus.homeMenu">
                        <button @click="navigateTo('historialbienes')">Historial de bienes</button>
                        <button @click="navigateTo('resguardo')">Bienes sin resguardo</button>
                        <button @click="navigateTo('listaalmacen')">Bienes nuevos</button>
                        <button @click="navigateTo('bienesnuevos')">Asignar resguardo</button>
                        <button @click="navigateTo('liberarbien')">Liberar Bien</button>
                        <button @click="navigateTo('bajabien')">Baja de bienes</button>
                        <button @click="navigateTo('bajas')">Historial de bajas</button>
                        <button @click="navigateTo('reportes')">Generación de reportes</button>
                    </div>
                </div>
                <div v-if="userRole === 'Usuarios' || userRole === 'Administrador'" class="nav-item" @mouseenter="showMenu('userMenu')"
                    @mouseleave="hideMenu('userMenu')">
                    Usuario
                    <span class="menu-icon">▼</span>
                    <div class="dropdown-menu" v-show="menus.userMenu">
                        <button @click="navigateTo('')">Solicitud de Material</button>
                        <button @click="navigateTo('resguardoUsuario')">Resguardo</button>
                    </div>
                </div>
            </div>

            <!-- Formulario -->
            <div class="form-container">
                <form @submit.prevent="registerUser">
                    <!-- Primera fila de campos -->
                    <div class="form-row">
                        <div class="form-field">
                            <label for="rol">Rol de usuario</label>
                            <select v-model="form.rol" required>
                                <option value="" disabled>Selecciona una opción</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Inventario">Inventario</option>
                                <option value="Almacenes">Almacenes</option>
                                <option value="Usuario">Usuario</option>
                            </select>
                        </div>
                        <div class="form-field">
                            <label for="nombre">Nombre(s)</label>
                            <input type="text" v-model="searchName" @input="filterUsers" required />
                            <ul v-if="filteredUsers.length > 0" class="autocomplete-list">
                                <li v-for="user in filteredUsers" :key="user.id" @click="selectUser(user)">
                                    {{ user.nombre }} {{ user.apellidos }}
                                </li>
                            </ul>
                        </div>
                        <div class="form-field">
                            <label for="apellidos">Apellidos</label>
                            <input type="text" v-model="form.apellidos" readonly style="background-color: #dcddcd;" />
                        </div>
                        <div class="form-field">
                            <label for="RFC">RFC</label>
                            <input type="text" v-model="form.RFC" readonly style="background-color: #dcddcd;" />
                        </div>
                    </div>

                    <!-- Segunda fila de campos -->
                    <div class="form-row">
                        <div class="form-field">
                            <label for="numero_trabajador">Num. Trabajador</label>
                            <input type="number" v-model="form.numero_trabajador" readonly
                                style="background-color: #dcddcd;" />
                        </div>
                        <div class="form-field">
                            <label for="CURP">CURP</label>
                            <input type="text" v-model="form.CURP" readonly style="background-color: #dcddcd;" />
                        </div>
                        <div class="form-field">
                            <label for="nivel">Nivel</label>
                            <input type="text" v-model="form.nivel" readonly style="background-color: #dcddcd;" />
                        </div>
                        <div class="form-field">
                            <label for="cargo">Cargo</label>
                            <input type="text" v-model="form.cargo" readonly style="background-color: #dcddcd;" />
                        </div>
                        <div class="form-field">
                            <label for="direccion_pertenencia">Direc. Pertenencia</label>
                            <input type="text" v-model="form.direccion_pertenencia" readonly
                                style="background-color: #dcddcd;" />
                        </div>
                    </div>

                    <!-- Tercera fila de campos -->
                    <div class="form-row">
                        <div class="form-field">
                            <label for="departamento">Departamento</label>
                            <input type="text" v-model="form.departamento" readonly style="background-color: #dcddcd;" />
                        </div>
                        <div class="form-field">
                            <label for="organo_superior">Organo Superior</label>
                            <input type="text" v-model="form.organo_superior" readonly style="background-color: #dcddcd;" />
                        </div>
                        <div class="form-field">
                            <label for="area_presupuestal">Área Presupuestal</label>
                            <input type="text" v-model="form.area_presupuestal" readonly
                                style="background-color: #dcddcd;" />
                        </div>
                        <div class="form-field">
                            <label for="email">Correo electrónico</label>
                            <input type="email" v-model="form.email" readonly style="background-color: #dcddcd;" />
                        </div>
                    </div>

                    <!-- Cuarta fila de campos -->
                    <div class="form-row">
                        <!-- Campo Doc -->
                        <div class="form-field">
                            <label for="identificacion">Identificación</label>
                            <div class="dropzone" style="background-color: #dcddcd;">
                                <span>{{ form.identificacion ? form.identificacion.split('/').pop() : 'No se ha seleccionado ninguna foto' }}</span>
                            </div>
                        </div>
                        <!-- Campo Foto -->
                        <div class="form-field">
                            <label for="imagen">Foto</label>
                            <div class="dropzone" style="background-color: #dcddcd;">
                                <span>{{ form.imagen ? form.imagen.split('/').pop() : 'No se ha seleccionado ninguna foto'
                                }}</span>
                            </div>
                        </div>
                        <div class="form-field">
                            <label for="password">Contraseña</label>
                            <div class="input-wrapper">
                                <input 
                                    :type="showPassword ? 'text' : 'password'" 
                                    v-model="form.password" 
                                    @input="validatePassword"
                                    @blur="validatePassword"
                                    required
                                    ref="passwordField"
                                />
                                <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
                                    @click="showPassword = !showPassword"></i>
                            </div>
                            <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
                        </div>
                        <div class="form-field" style="margin-bottom: 15px;">
                            <label for="confirm_password">Confirmar Contraseña</label>
                            <div class="input-wrapper">
                                <input 
                                    :type="showConfirmPassword ? 'text' : 'password'" 
                                    v-model="form.confirm_password" 
                                    @input="validateConfirmPassword"
                                    @blur="validateConfirmPassword"
                                    required
                                />
                                <i :class="showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
                                    @click="showConfirmPassword = !showConfirmPassword"></i>
                            </div>
                            <span class="error-message" v-if="errors.confirm_password">{{ errors.confirm_password }}</span>
                        </div>
                    </div>

                    <!-- Botón de registro -->
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
            
            <div v-if="alertMessage" :class="alertClass" class="notification">
                <i :class="alertIcon"></i> {{ alertMessage }}
            </div>
        </div>
    </div>    
</template>

<script>
import axios from 'axios';
import NavBarPage from './NavBar.vue';
export default {
    name: "RegisterPage",
    components: {
        NavBarPage // Registrar el componente
    },
    data() {
        return {
            userName: "Cargando...",
            profileImage: "",
            alertMessage: "",
            alertClass: "",
            alertIcon: "",
            searchName: "",
            form: {
                rol: "",
                password: "",
                confirm_password: "",
                id: "",
                nombre: "",
                apellidos: "",
                RFC: "",
                numero_trabajador: "",
                CURP: "",
                nivel: "",
                cargo: "",
                direccion_pertenencia: "",
                departamento: "",
                organo_superior: "",
                area_presupuestal: "",
                email: "",
                identificacion: "",
                imagen: ""
            },
            errors: {
                password: "",
                confirm_password: ""
            },
            menus: {
                homeMenu: false,
                proveedorMenu: false,
                settingsMenu: false,
                userMenu: false,
            },
            showPassword: false,
            showConfirmPassword: false,
            showModal: false,
            showAlertModal: false,
            alertMessageList: [],
            personas: [],
            filteredUsers: []
        };
    },
    mounted() {
        this.loadPersonas();
        this.loadUserData();
    },
    methods: {
        validatePassword() {
            if (!this.form.password) {
                this.errors.password = "Complete este campo";
                return false;
            }
            
            if (!/[A-Z]/.test(this.form.password)) {
                this.errors.password = "Falta una letra mayúscula";
                return false;
            }
            
            if (!/[a-z]/.test(this.form.password)) {
                this.errors.password = "Falta una letra minúscula";
                return false;
            }
            
            if (!/\d/.test(this.form.password)) {
                this.errors.password = "Falta un número";
                return false;
            }
            
            if (!/[@$!%*?&]/.test(this.form.password)) {
                this.errors.password = "Falta un carácter especial (@$!%*?&)";
                return false;
            }
            
            if (this.form.password.length < 8 || this.form.password.length > 16) {
                this.errors.password = "Debe tener entre 8-16 caracteres";
                return false;
            }
            
            this.errors.password = "";
            return true;
        },
        
        validateConfirmPassword() {
            if (!this.form.confirm_password) {
                this.errors.confirm_password = "Complete este campo";
                return false;
            }
            
            if (this.form.password !== this.form.confirm_password) {
                this.errors.confirm_password = "Las contraseñas no coinciden";
                return false;
            }
            
            this.errors.confirm_password = "";
            return true;
        },

        async loadPersonas() {
            try {
                const response = await axios.get('http://localhost:3000/api/personas');
                this.personas = response.data;
            } catch (error) {
                console.error('Error al cargar personas', error);
                this.alertMessageList = ['Error al cargar la lista de personas.'];
                this.showAlertModal = true;
            }
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

        filterUsers() {
            if (this.searchName.trim() !== "") {
                const searchTerm = this.searchName.toLowerCase();
                this.filteredUsers = this.personas
                    .filter(persona => persona.nombre.toLowerCase().includes(searchTerm))
                    .sort((a, b) => a.nombre.localeCompare(b.nombre));
            } else {
                this.filteredUsers = [];
            }
        },

        selectUser(persona) {
            this.form.id = persona.id;
            this.form.nombre = persona.nombre;
            this.form.apellidos = persona.apellidos;
            this.form.RFC = persona.RFC;
            this.form.numero_trabajador = persona.numero_trabajador;
            this.form.CURP = persona.CURP;
            this.form.nivel = persona.nivel;
            this.form.cargo = persona.cargo;
            this.form.direccion_pertenencia = persona.direccion_pertenencia;
            this.form.departamento = persona.departamento;
            this.form.organo_superior = persona.organo_superior;
            this.form.area_presupuestal = persona.area_presupuestal;
            this.form.email = persona.email;
            this.form.identificacion = persona.identificacion || "No disponible";
            this.form.imagen = persona.imagen || "No disponible";

            this.searchName = `${persona.nombre}`;
            this.filteredUsers = [];
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

        async registerUser() {
            // Validar campos de contraseña
            const isPasswordValid = this.validatePassword();
            const isConfirmValid = this.validateConfirmPassword();
            
            if (!isPasswordValid || !isConfirmValid) {
                return;
            }

            // Validar otros campos requeridos
            const requiredFields = ["rol", "id"];
            const emptyFields = requiredFields.filter(field => !this.form[field]);

            if (emptyFields.length > 0) {
                this.alertMessageList = ["Todos los campos son obligatorios."];
                this.showAlertModal = true;
                return;
            }

            // Crear el objeto de datos
            const userData = {
                rol: this.form.rol,
                password: this.form.password,
                id_persona: this.form.id,
            };

            try {
                const response = await axios.post('http://localhost:3000/api/usuarios', userData);
                console.log('Usuario registrado con éxito', response.data);
                this.showModal = true;
            } catch (error) {
                console.error('Error al registrar usuario', error.response?.data || error);
                this.alertMessageList = ['Error al registrar usuario. Intenta de nuevo.'];
                this.showAlertModal = true;
            }
        },

        navigateTo(page) {
            this.$router.push({ name: page });
        },
        showMenu(menuName) {
            this.menus[menuName] = true;
        },
        hideMenu(menuName) {
            this.menus[menuName] = false;
        },
        closeModal() {
            this.showModal = false;
            this.$router.push("/users");
        },
        closeAlertModal() {
            this.showAlertModal = false;
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
    color: #ff0000;
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

input:invalid {
    border-color: #ff0000;
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

.page-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
}

.container {
    flex: 1;
    width: 100%;
    padding: 20px;
    background-color: #f5f5f5;
    min-height: calc(100vh - 140px);
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
    width: auto;
    height: auto;
    border-collapse: separate;
    border-spacing: 0;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.form-row {
    display: flex;
    justify-content: center;
    margin-bottom: auto;
    padding-bottom: autp;
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

.autocomplete-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    border-top: none;
    max-height: 150px;
    overflow-y: auto;
    position: absolute;
    width: 300px;
    background-color: #A02142;
    z-index: 1000;
    color: white;
}

.autocomplete-list li {
    padding: 8px;
    cursor: pointer;
}

.autocomplete-list li:hover {
    background-color: #dcdcdc;
    color: #691B31;
}
</style>