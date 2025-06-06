<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
    <div class="container">
        <nav class="navbar">
            <div class="navbar-left">
                <img src="../assets/LOGOS DORADOS-02.png" alt="Icono" class="navbar-icon" @click="goHome" width="50%"
                    height="auto" style="cursor: pointer;" />
            </div>
            <div class="navbar-center">
                <h1>Perfil</h1>
                <p>Sistema de Almacén e Inventarios de Radio y Televisión de Hidalgo</p>
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
            <a v-if="userRole === 'Administrador'" href="users" class="nav-item">Usuarios</a>
            <!-- Menú de Inventario para Administrador e Inventario (todas las opciones) -->
           <div v-if="userRole === 'Almacenes' || userRole === 'Administrador'" class="nav-item" @mouseenter="showMenu('almacenMenu')"
                @mouseleave="hideMenu('almacenMenu')">
                Almacén
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.almacenMenu">
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('existencia')">Entrada de artículos</button>
                    <button @click="navigateTo('solicitudmaterial')">Salida de material</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepción de solicitudes</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('poliza')">Pólizas</button>
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

            <div v-if="userRole === 'Inventario' || userRole === 'Administrador'" class="nav-item" @mouseenter="showMenu('homeMenu')"
                @mouseleave="hideMenu('homeMenu')">
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
        </div>

        <!-- Formulario -->
        <div class="form-container">
            <form @submit.prevent="registerUser">
                <!-- Botón de Cambiar Contraseña -->
                <div class="button-password-change">
                    <button type="button"
                        style="background-color: #A02142; display: flex; align-items: center; gap: 8px;"
                        @click="changePassword">
                        Cambiar Contraseña
                        <i class="fas fa-key icono-derecha"></i> <!-- Icono de llave como ejemplo -->
                    </button>
                </div>

                <div class="form-row">
                    <div class="form-field">
                        <label for="nombre">Nombre(s)</label>
                        <input type="text" v-model="form.nombre" disabled />
                    </div>
                    <div class="form-field">
                        <label for="apellido">Apellidos</label>
                        <input type="text" v-model="form.apellidos" disabled />
                    </div>
                    <div class="form-field">
                        <label for="rfc">RFC</label>
                        <input type="text" v-model="form.rfc" style="text-transform: uppercase;" disabled />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-field">
                        <label for="numtrabajador">Num. Trabajador</label>
                        <input type="number" v-model="form.numTrabajador" disabled />
                    </div>
                    <div class="form-field">
                        <label for="curp">CURP</label>
                        <input type="text" v-model="form.curp" style="text-transform: uppercase;" disabled />
                    </div>
                    <div class="form-field">
                        <label for="pertenencia">Direc. Pertenencia</label>
                        <input type="text" v-model="form.direccion" disabled />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-field">
                        <label for="departamento">Departamento</label>
                        <input type="text" v-model="form.departamento" disabled />
                    </div>
                </div>

                <div class="button-container">
                    <button class="boton" type="button" @click="logout">
                        Cerrar Sesión
                        <i class="fas fa-sign-out-alt icono-derecha"></i> <!-- Icono de ejemplo -->
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProfilePage",
    data() {
        return {
            userRole: localStorage.getItem('userRole') || '', // Obtener el rol desde el localStorage
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario
            form: {
                nombre: "",
                apellidos: "",
                rfc: "",
                numTrabajador: "",
                curp: "",
                direccion: "",
                departamento: "",
            },
            menus: {
                homeMenu: false,
                proveedorMenu: false,
                settingsMenu: false,
            },
        };
    },
    mounted() {
        this.loadUserInfo();
        this.loadUserData();

    },
    methods: {
        showMenu(menu) {
            this.menus[menu] = true;
        },
        hideMenu(menu) {
            this.menus[menu] = false;
        },
        async loadUserData() {
            const storedUserName = localStorage.getItem("userName");
            const storedUserEmail = localStorage.getItem("userEmail");

            if (storedUserName && storedUserEmail) {
                this.userName = storedUserName;

                try {
                    // Obtener todos los usuarios de la API
                    const response = await fetch('http://localhost:3000/api/personas');
                    const users = await response.json();

                    // Buscar el usuario logueado por email
                    const user = users.find(u => u.email === storedUserEmail);

                    if (user) {
                        // Concatenar nombre y apellidos
                        const fullName = `${user.nombre || storedUserName} ${user.apellidos || ""}`.trim();
                        this.userName = fullName;

                        // Obtener la ruta completa de la imagen del usuario
                        const imagePath = user.imagen; // Suponiendo que la API devuelve la ruta completa

                        // Extraer el nombre del archivo de la ruta completa
                        let imageFileName = imagePath.split('\\').pop(); // Extrae "radio2.jpg"

                        // Eliminar la extensión del nombre del archivo
                        if (imageFileName) {
                            imageFileName = imageFileName.split('.').slice(0, -1).join('.'); // Elimina la extensión
                        }

                        if (imageFileName) {
                            // Construir la URL completa para la imagen
                            this.profileImage = `http://localhost:3000/api/users-files/${imageFileName}`;
                        } else {
                            // Usar una imagen por defecto si no hay imagen en la API
                            this.profileImage = "../assets/UserHombre.png";
                        }
                    } else {
                        this.profileImage = "../assets/UserHombre.png"; // Imagen por defecto
                    }
                } catch (error) {
                    console.error('Error al cargar los datos del usuario:', error);
                    this.profileImage = "../assets/UserHombre.png"; // Imagen por defecto en caso de error
                }
            } else {
                this.userName = "Usuario desconocido";
                this.profileImage = "../assets/UserHombre.png"; // Imagen por defecto
            }
        },
        loadUserInfo() {
            const storedUserName = localStorage.getItem("userName");
            this.userName = storedUserName ? storedUserName : "Usuario desconocido";

            const storedUserEmail = localStorage.getItem("userEmail");
            if (storedUserEmail) {
                this.fetchUserData(storedUserEmail);
            }
        },
        async fetchUserData(email) {
            try {
                const response = await fetch('http://localhost:3000/api/personas');
                const users = await response.json();
                const user = users.find(u => u.email === email);

                if (user) {
                    this.form.nombre = user.nombre;
                    this.form.apellidos = user.apellidos;
                    this.form.rfc = user.RFC;
                    this.form.numTrabajador = user.numero_trabajador;
                    this.form.curp = user.CURP;
                    this.form.direccion = user.direccion_pertenencia;
                    this.form.departamento = user.departamento;
                }
            } catch (error) {
                console.error("Error al cargar los datos del usuario", error);
            }
        },
        navigateTo(page) {
            console.log(`Navegando a ${page}`);
            this.$router.push({ name: page }); // Asegúrate de que las rutas estén definidas con `name`.
        },
        goHome() {
            this.$router.push('/home');
        },
        logout() {
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            this.$router.push('/'); // Redirige a la página de login
        },
        changePassword() {
            // Lógica para cambiar la contraseña
            this.$router.push('/newpassword'); // Redirige a la página de cambio de contraseña
        }
    }
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
    padding-bottom: 5%;
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



.form-field {
    padding-left: 3%;
    padding-right: 6%;
}

a {
    text-decoration: none;
}

.button-password-change {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
}

.button-password-change button {
    padding: 10px;
    width: 20%;
    background: #691B31;
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 12px;
    cursor: pointer;
}

.button-password-change button:hover {
    background: #590d22;
}
</style>