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
                    <img :src="profileImage" alt="User Profile" class="profile-pic" />
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
            <a href="users" class="nav-item" style="color: #6F7271; ">Usuarios</a>
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

            <div class="nav-item" @mouseenter="showMenu('usersMenu')" @mouseleave="hideMenu('usersMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.usersMenu">
                    <button @click="navigateTo('solicitudmaterial')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('existencia')">Entrada de existencias</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
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
                        <label for="rol">Rol de usuario</label>
                        <select v-model="form.rol" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Inventario">Inventario</option>
                            <option value="Almacenes">Almacenes</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label for="nombre">Nombre(s)</label>
                        <input type="text" v-model="form.nombre" @input="filterUsers" required />
                        <ul v-if="filteredUsers.length > 0" class="autocomplete-list">
                            <li v-for="user in filteredUsers" :key="user.nombre" @click="selectUser(user)">
                                {{ user.nombre }}
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
                <div class="form-row">
                    <div class="form-field">
                        <label for="numero_trabajador">Num. Trabajador</label>
                        <input type="number" v-model="form.numero_trabajador" readonly style="background-color: #dcddcd;" />
                    </div>
                    <div class="form-field">
                        <label for="CURP">CURP</label>
                        <input type="text" v-model="form.CURP" readonly style="background-color: #dcddcd;" />
                    </div>
                    <div class="form-field">
                        <label for="direccion_pertenencia">Direc. Pertenencia</label>
                        <input type="text" v-model="form.direccion_pertenencia" readonly style="background-color: #dcddcd;" />
                    </div>
                    <div class="form-field">
                        <label for="departamento">Departamento</label>
                        <input type="text" v-model="form.departamento" readonly style="background-color: #dcddcd;" />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-field">
                        <label for="organo_superior">Organo Superior</label>
                        <input type="text" v-model="form.organo_superior"  style="background-color: #dcddcd;" />
                    </div>
                    <div class="form-field">
                        <label for="area_presupuestal">Área Presupuestal</label>
                        <input type="text" v-model="form.area_presupuestal" readonly style="background-color: #dcddcd;" />
                    </div>
                    <div class="form-field">
                        <label for="email">Correo electrónico</label>
                        <input type="email" v-model="form.email" readonly style="background-color: #dcddcd;" />
                    </div>
                    <div class="form-field">
                        <label for="password">Contraseña</label>
                        <div class="input-wrapper">
                            <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required />
                            <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
                                @click="showPassword = !showPassword"></i>
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-field" style="margin-bottom: 15px;">
                        <label for="confirm_password">Confirmar Contraseña</label>
                        <div class="input-wrapper">
                            <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirm_password"
                                required />
                            <i :class="showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"
                                @click="showConfirmPassword = !showConfirmPassword"></i>
                        </div>
                    </div>
                    <!-- Campo Doc -->
                    <div class="form-field">
                        <label for="identificacion">Identificación</label>
                        <div class="dropzone" style="background-color: #dcddcd;">
                            <span>{{ form.identificacion ? form.identificacion.split('/').pop() : 'No se ha seleccionado ninguna foto'
                                }}</span>
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
                </div>
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
    </div>
</template>

<script>
export default {
    name: "RegisterPage",
    data() {
        return {
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario
            form: {
                rol: "",
                nombre: "",
                apellidos: "",
                RFC: "",
                numero_trabajador: "",
                CURP: "",
                direccion_pertenencia: "",
                departamento: "",
                organo_superior: "Organismos Descentralizados",
                area_presupuestal: "RADIO Y TELEVISION DE HIDALGO",
                email: "",
                password: "",
                confirm_password: "",
                identificacion: "", // Ruta del archivo de identificación
                imagen: "", // Ruta de la imagen
            },
            showPassword: false,
            showConfirmPassword: false,
            menus: {
                homeMenu: false,
                usersMenu: false,
                settingsMenu: false,
            },
            showModal: false,
            showAlertModal: false,
            alertMessageList: [],
            users: [
                {
                    nombre: "Juan Gómez Cruz",
                    apellidos: "Gómez Cruz",
                    RFC: "JUAP921214ABC",
                    numero_trabajador: "12345",
                    CURP: "JUAP921214HDFGH01",
                    direccion_pertenencia: "Dirección General",
                    departamento: "Administración",
                    email: "juan.perez@example.com",
                    identificacion: "/path/to/identificacion1.pdf",
                    imagen: "/path/to/foto1.jpg",
                },
                {
                    nombre: "María Martínez López",
                    apellidos: "Martínez López",
                    RFC: "MALO850701XYZ",
                    numero_trabajador: "67890",
                    CURP: "MALO850701MDFGH02",
                    direccion_pertenencia: "Dirección de Televisión",
                    departamento: "Producción",
                    email: "maria.lopez@example.com",
                    identificacion: "/path/to/identificacion2.pdf",
                    imagen: "/path/to/foto2.jpg",
                },
            ],
            filteredUsers: [],
        };
    },
    methods: {
        filterUsers() {
            if (this.form.nombre.trim() !== "") {
                const searchTerm = this.form.nombre.toLowerCase();
                this.filteredUsers = this.users
                    .filter(user => user.nombre.toLowerCase().includes(searchTerm))
                    .sort((a, b) => a.nombre.localeCompare(b.nombre));
            } else {
                this.filteredUsers = [];
            }
        },
        selectUser(user) {
            this.form.nombre = user.nombre;
            this.form.apellidos = user.apellidos;
            this.form.RFC = user.RFC;
            this.form.numero_trabajador = user.numero_trabajador;
            this.form.CURP = user.CURP;
            this.form.direccion_pertenencia = user.direccion_pertenencia;
            this.form.departamento = user.departamento;
            this.form.email = user.email;
            this.form.identificacion = user.identificacion;
            this.form.imagen = user.imagen;
            this.filteredUsers = [];
        },
        registerUser() {
            if (this.form.password !== this.form.confirm_password) {
                this.alertMessageList = ["Las contraseñas no coinciden."];
                this.showAlertModal = true;
                return;
            }
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.$router.push("/users");
        },
        closeAlertModal() {
            this.showAlertModal = false;
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