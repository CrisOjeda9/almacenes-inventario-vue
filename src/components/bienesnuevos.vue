<template>
    <div class="page-wrapper">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        <NavBarPage :pageTitle="'Bienes nuevos para asignar resguardo'" :showUserMenu="true" />
        <div class="container">
            <div class="search-bar">

                <div class="input-wrapper">
                    <input type="text" v-model="searchQuery" placeholder="Buscar..." />
                    <i class="fas fa-search"></i> <!-- Icono de la lupa -->
                </div>
            </div>

            <div class="contenedor-tabla">
                <!-- Tabla con botón para descargar QR -->
                <!-- Tabla con botón para descargar QR -->
                <table class="bienesnuevos-table">
                    <thead>
                        <tr>
                            <th>Tipo de Inventario</th>
                            <th>No. Inventario</th>
                            <th>Descripción</th>
                            <th>Color</th>
                            <th>Material</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Serie</th>
                            <th>Descargar QR</th>

                            <th>Asignar Usuario</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="bienesnuevos in paginatedBienNuevo" :key="bienesnuevos.id">

                            <td>{{ bienesnuevos.tipoinventario }}</td>
                            <td>{{ bienesnuevos.noinventario }}</td>
                            <td>{{ bienesnuevos.descripcion }}</td>
                            <td>{{ bienesnuevos.color }}</td>
                            <td>{{ bienesnuevos.material }}</td>
                            <td>{{ bienesnuevos.marca }}</td>
                            <td>{{ bienesnuevos.modelo }}</td>
                            <td>{{ bienesnuevos.serie }}</td>
                            <td>
                                <button class="boton" @click="generateAndDownloadQRCode(bienesnuevos)">
                                    <i class="fas fa-qrcode"></i>
                                </button>
                            </td>
                            <td>
                                <button @click="redirectToAddbienesnuevos" class="btn-bienesnuevos">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Paginador -->
                <div class="pagination">
                    <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Anterior</button>
                    <span>Página {{ currentPage }} de {{ totalPages }}</span>
                    <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">Siguiente</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import QRCode from 'qrcode';
import NavBarPage from './NavBar.vue';
export default {
    name: "bienesnuevosPage",
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
                bienesnuevosMenu: false,
                settingsMenu: false,
                userMenu: false,
            },
            searchQuery: '',
            bienesnuevos: [
                {
                    tipoinventario: 'RTH',
                    noinventario: "123456",
                    descripcion: "Laptop",
                    color: "Negro",
                    material: "Plástico",
                    marca: "Sony",
                    modelo: "2021",
                    serie: "ABC123",
                    usuario_id: null,
                },

                // Agrega más usuarios aquí...
            ],
            itemsPerPage: 10, // Cantidad de elementos por página
            currentPage: 1, // Página actual
            qrData: "",


        };
    },
    computed: {
        filteredSolicitudes() {
            return this.bienesnuevos.filter(bienesnuevos => {
                const query = this.searchQuery.toLowerCase();
                return (bienesnuevos.noinventario.toLowerCase().includes(query) ||
                    bienesnuevos.tipoinventario.toLowerCase().includes(query) ||
                    bienesnuevos.descripcion.toLowerCase().includes(query) ||
                    bienesnuevos.color.toLowerCase().includes(query) ||
                    bienesnuevos.material.toLowerCase().includes(query) ||
                    bienesnuevos.marca.toLowerCase().includes(query) ||
                    bienesnuevos.modelo.toLowerCase().includes(query) ||
                    bienesnuevos.serie.toLowerCase().includes(query));

            });
        },
        // Número total de páginas
        totalPages() {
            return Math.ceil(this.filteredSolicitudes.length / this.itemsPerPage);
        },
        paginatedBienNuevo() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredSolicitudes.slice(start, end);
        },
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
        generateAndDownloadQRCode(bien) {
            // Formatear el número de inventario con el tipo
            const inventarioFormatted = `${bien.tipoinventario}-${bien.noinventario}`;

            // Construir los datos en formato clave-valor
            const qrData = `Tipo Inventario: ${bien.tipoinventario}\n` +
                `Número Inventario: ${inventarioFormatted}\n` +
                `Descripción: ${bien.descripcion}\n` +
                `Color: ${bien.color}\n` +
                `Material: ${bien.material}\n` +
                `Marca: ${bien.marca}\n` +
                `Modelo: ${bien.modelo}\n` +
                `Serie: ${bien.serie}`;

            QRCode.toDataURL(qrData, (error, url) => {
                if (error) {
                    console.error("Error generando el código QR", error);
                    return;
                }
                const link = document.createElement("a");
                link.href = url;
                link.download = "codigo_qr.png";
                link.click();
            });
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
        redirectToAddbienesnuevos() {
            // Aquí defines la ruta a la que quieres redirigir al hacer clic en el botón
            this.$router.push('/asignarbienusuario');
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
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

.pagination {
    display: flex;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;

}

.pagination button {
    margin-left: 20px;
    margin-right: 20px;
}

.titulo {
    font-size: 30px;
    font-weight: 100;
    text-align: center;
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

.bienesnuevos-table {
    width: 50%;
    border-collapse: separate;
    border-spacing: 0;
    background-color: white;
    color: #691B31;
    border-radius: 15px;
    /* Redondear las esquinas de la tabla */
    overflow: hidden;
    /* Para que los bordes no sobresalgan */
}

.bienesnuevos-table th,
.bienesnuevos-table td {
    padding: 10px;
    text-align: center;
}

.bienesnuevos-table th {
    background-color: #BC955B;
    color: white;
}

.bienesnuevos-table tr:hover {
    background-color: #70727265;
    color: #A02142;
    transition: background-color 0.3s ease;
}

.btn-bienesnuevos {
    width: 50px;
    height: 50px;
    text-align: center;
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 15px;
    padding-right: 15px;
    border: none;
    cursor: pointer;
}

.btn-bienesnuevos {
    background-color: #BC955B;
    color: white;
    margin-bottom: 4px;
}



.btn-bienesnuevos:hover {
    background-color: #DDC9A3;
}



.contenedor-tabla {
    display: flex;
    flex-direction: column;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Barra de búsqueda */
.search-bar {
    margin: 12px 0;
    text-align: center;
}

.input-wrapper {
    position: relative;
    width: 60%;
    display: inline-block;
}

.input-wrapper input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border-radius: 25px;
    border: 1px solid #BC955B;
    background-color: #fff;
}

.input-wrapper i {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #691B31;
    pointer-events: none;
}

.input-wrapper input::placeholder {
    color: #691B31;
}
</style>