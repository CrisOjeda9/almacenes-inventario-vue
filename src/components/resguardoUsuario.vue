<template>
    <div class="page-wrapper">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        <NavBarPage :pageTitle="'Resguardo'" :showUserMenu="true" />
        <div class="container">
            <div class="search-bar">
                <div class="input-wrapper">
                    <input type="text" v-model="searchQuery" placeholder="Buscar..." />
                    <i class="fas fa-search"></i> <!-- Icono de la lupa -->
                </div>
            </div>

            <div class="contenedor-tabla">
                <table class="bienes-table">
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Serie</th>
                            <th>Foto del Bien</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="bienes in paginatedBienes" :key="bienes.id">
                            <td>{{ bienes.descripcion }}</td>
                            <td>{{ bienes.marca }}</td>
                            <td>{{ bienes.modelo }}</td>
                            <td>{{ bienes.serie }}</td>
                            <td>
                                <button @click="openModal(bienes.fotoBien)" class="btn-download">
                                    <i class="fas fa-eye"></i>
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
            <!-- Modal para mostrar imágenes -->
            <div v-if="showModal" class="modal-overlay" @click="closeModal">
                <div class="modal" @click.stop>
                    <h2>Imágenes</h2>
                    <hr>
                    <div class="image-container">
                        <div v-for="(foto, i) in modalImages" :key="i" class="image-box">
                            <!-- Envolvemos la imagen con un enlace -->
                            <a :href="getImageUrl(foto)" target="_blank">
                                <img :src="getImageUrl(foto)" alt="Foto del bien recibido" class="modal-img" />
                            </a>
                            <p class="image-name">{{ foto }}</p>
                        </div>
                    </div>
                    <button @click="closeModal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NavBarPage from './NavBar.vue';
export default {
    name: "resguardoUsuarioPage",
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
                bienesMenu: false,
                settingsMenu: false,
                userMenu: false,
            },
            searchQuery: '',
            bienes: [
                {
                    descripcion: "Computadora de escritorio",
                    marca: "HP",
                    modelo: "Pavilion",
                    serie: "123456789",
                    fotoBien: ["laptop.jpeg"],
                },
                {
                    descripcion: "Impresora láser",
                    marca: "Epson",
                    modelo: "L120",
                    serie: "987654321",
                    fotoBien: ["laptop.jpeg"]
                },
                // Agrega más bienes aquí...
            ],
            itemsPerPage: 10, // Cantidad de elementos por página
            currentPage: 1, // Página actual
            filterTerm: '', // Variable para filtrar por término específico
            showModal: false,
            modalImages: [],
            itemToRemove: null,

        };
    },
    computed: {
        filteredBienes() {
            return this.bienes.filter(bien => {
                const query = this.searchQuery.toLowerCase();
                return (
                    bien.descripcion.toLowerCase().includes(query) ||
                    bien.marca.toLowerCase().includes(query) ||
                    bien.modelo.toLowerCase().includes(query) ||
                    bien.serie.toLowerCase().includes(query)
                );
            });
        },
        // Número total de páginas
        totalPages() {
            return Math.ceil(this.filteredBienes.length / this.itemsPerPage);
        },
        paginatedBienes() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredBienes.slice(start, end);
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
        openModal(fotos) {
            this.modalImages = fotos;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.modalImages = [];
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
        redirectToAddbienes() {
            // Aquí defines la ruta a la que quieres redirigir al hacer clic en el botón
            this.$router.push('/register');
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        getImageUrl(image) {
            return require(`@/assets/${image}`);
        }
    },
};
</script>

<style scoped>
/* Aplicar Montserrat a todo el contenido */
* {
    font-family: 'Montserrat', sans-serif;
}

.image-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    /* Muestra 5 imágenes por fila */
    gap: 10px;
    /* Espacio entre las imágenes */
    margin-top: 20px;
}

.image-name {
    font-size: 12px;
    color: #333;
    margin-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;

}


.modal-img {
    max-width: 300px;
    border-radius: 8px;
    width: auto;
    height: 120px;

}


/* Efecto de zoom al pasar el cursor por encima de la imagen */
.modal-img:hover {
    transition: transform 0.3s ease-in-out;
    transform: scale(1.1);
    box-shadow: 0 4px 8px #6f7271;
    /* Hace que la imagen crezca al 150% de su tamaño */
}

.modal-overlay {
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

.modal {
    background: white;
    color: #691B31;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 1100px;
}

.modal-overlay.show {
    visibility: visible;
}

.modal button {
    padding: 10px 20px;
    background-color: #BC955B;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.modal button:hover {
    background-color: #691B31;
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

.bienes-table {
    width: 80%;
    border-collapse: separate;
    border-spacing: 0;
    background-color: white;
    color: #691B31;
    border-radius: 15px;
    /* Redondear las esquinas de la tabla */
    overflow: hidden;
    /* Para que los bordes no sobresalgan */
}

.bienes-table th,
.bienes-table td {
    padding: 10px;
    text-align: center;
}

.bienes-table th {
    background-color: #BC955B;
    color: white;
}

.bienes-table tr:hover {
    background-color: #70727265;
    color: #A02142;
    transition: background-color 0.3s ease;
}

.btn-edit,
.btn-delete {
    text-align: center;
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 15px;
    padding-right: 15px;
    border: none;
    cursor: pointer;
}

.btn-edit {
    background-color: #4CAF50;
    color: white;
    margin-bottom: 4px;
}

.btn-delete {
    background-color: #f44336;
    color: white;

}

.btn-edit:hover {
    background-color: #45a049;
}

.btn-delete:hover {
    background-color: #e41f1f;
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

.search-bar select {
    padding: 10px;
    border-radius: 10px;
    justify-content: space-between;
    margin-right: 15px;
}

.btn-download {
    width: 50px;
}
</style>