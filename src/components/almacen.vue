<template>
    <div class="page-wrapper">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">

        <NavBarPage :pageTitle="'Almacen'" :showUserMenu="true" />
        <div class="container">

            <div class="menu">
                <!-- Fila 1 -->
                <div class="button-card" @click="navigateTo2('proveedor')">
                    <i class="fas fa-handshake"></i> <!-- Ícono de ver proveedores -->
                    <span>Ver proveedores</span>
                </div>
                <div class="button-card" @click="navigateTo2('factura')">
                    <i class="fas fa-file-invoice"></i>
                    <span>Facturas</span>
                </div>
                <div class="button-card" @click="navigateTo2('existencia')">
                    <i class="fas fa-arrow-circle-down"></i> <!-- Ícono de entrada de existencias -->
                    <span>Entrada de Artículos</span>
                </div>
                
            </div>

            <!-- Nueva fila de botones -->
            <div class="menu">
                    
                <div class="button-card" @click="navigateTo2('solicitudmaterial')">
                    <i class="fas fa-cart-plus"></i> <!-- Ícono de Salida de materiales -->
                    <span>Salida de materiales</span>
                </div>
                <div class="button-card" @click="navigateTo2('recepcionsolicitudes')">
                    <i class="fas fa-box"></i> <!-- Ícono de recepción de solicitudes -->
                    <span>Recepción de solicitudes</span>
                </div>

                
            <div class="button-card" @click="navigateTo2('bieninventario')">
                    <i class="fas fa-plus-circle"></i> <!-- Ícono de agregar un bien para inventario -->
                    <span>Agregar un bien para inventario</span>
                </div>

                <div class="button-card" @click="navigateTo2('poliza')">
                    <i class="fas fa-file-contract"></i>
                    <span>Pólizas</span>
                </div>
            </div>
        </div>
    </div>    
</template>

<script>
import api from '../services/api';
import NavBarPage from './NavBar.vue';
export default {
    name: "almacenPage",
    components: {
        NavBarPage // Registrar el componente
    },
    data() {
        return {
            userRole: localStorage.getItem('userRole') || '', // Obtener el rol desde el localStorage
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario



            menus: {
                homeMenu: false,
                almacenMenu: false,
                settingsMenu: false,
                userMenu: false,

            },
        };
    },
    mounted() {
        this.loadUserData();
    },

    methods: {
        async loadUserData() {
            const storedUserName = localStorage.getItem("userName");
            const storedUserEmail = localStorage.getItem("userEmail");

            if (storedUserName && storedUserEmail) {
                this.userName = storedUserName;

                try {
                    // Obtener todos los usuarios de la API
                    const response = await api.get('/personas');
                    const users = response.data; 

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
                            this.profileImage = `http://192.168.10.31:3000/api/users-files/${imageFileName}`;
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
        goHome() {
            this.$router.push('home'); // Redirige a la página principal ("/"). Cambia el path si es necesario.
        },
        goBack() {
            console.log("Regresar a la página anterior");
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
        navigateTo2(route) {
            this.$router.push({ name: route });
        }
    },
};
</script>

<style scoped>
* {
    font-family: 'Montserrat', sans-serif;
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


a {
    text-decoration: none;
}

.menu {

    display: flex;
    justify-content: center;
    gap: 20px;
    /* Espacio entre los botones */
    margin-top: 4%;
}

.button-card {
    width: 260px;
    height: 140px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background:linear-gradient(to right, #691B31, #A02142);
    /* Gradiente suave */
    color: #FFFFFF;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    /* Sombra sutil */
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
    /* Transición suave */
}

.button-card:hover {
    transform: translateY(-10px);
    /* Desplazamiento suave hacia arriba */
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    /* Sombra más profunda */
}

.button-card i {
    font-size: 50px;
    margin-bottom: 15px;
    transition: transform 0.3s ease, color 0.3s ease;
    /* Efecto de cambio suave */
}

.button-card:hover i {
    transform: scale(1.2);
    /* Escala suave */
    color: #bc955b;
    /* Color dorado en hover */
}

.button-card span {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    transition: color 0.3s ease;
    /* Cambio de color en hover */
}

.button-card:hover span {
    color: #bc955b;
    /* Color dorado en hover */
}

.button-card:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transform: scaleX(0);
    transform-origin: 100% 100%;
    transition: transform 0.4s ease;
    /* Efecto de barra sutil */
}

.button-card:hover:before {
    transform: scaleX(1);
    /* Expande la capa al hacer hover */
}

.badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #870f33;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}
</style>