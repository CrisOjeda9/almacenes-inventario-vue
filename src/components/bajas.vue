<template>
    <div class="page-wrapper">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        <NavBarPage :pageTitle="'Historial de Bajas'" :showUserMenu="true" />
        <div class="container">
            <div class="search-bar">
                <!-- Caja de selección para el filtro -->
                <select v-model="filterTerm">
                    <option value="">Tipo de Procedencia</option>
                    <option value="RTH">RTH</option>
                    <option value="GA">GA</option>
                    <option value="NT">NT</option>
                    <option value="DON">DON</option>
                    <option value="PG">PG</option>
                </select>
                <div class="input-wrapper">
                    <input type="text" v-model="searchQuery" placeholder="Buscar..." />
                    <i class="fas fa-search"></i> <!-- Icono de la lupa -->
                </div>
            </div>

            <div class="contenedor-tabla">
                <table class="bajas-table">
                    <thead>
                        <tr>
                            <th>No. Bien</th>
                            <th>Descripción</th>
                            <th>Modelo</th>
                            <th>Marca</th>
                            <th>Serie</th>
                            <th>Fecha de Baja</th>
                            <th>Tipo de Baja</th>
                            <th>Unidad Presupuestal</th>
                            <th>Órgano Superior</th>
                            <th>Documento Baja</th>
                            <th>Oficio Dictamen</th>
                            <th>Foto Bien</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="baja in paginatedBajas" :key="baja.id">
                            <td>{{ baja.numerobien }}</td>
                            <td>{{ baja.descripcion }}</td>
                            <td>{{ baja.modelo }}</td>
                            <td>{{ baja.marca }}</td>
                            <td>{{ baja.serie }}</td>
                            <td>{{ baja.fechaBaja }}</td>
                            <td>{{ baja.tipoBaja }}</td>
                            <td>{{ baja.unidadPresupuestal }}</td>
                            <td>{{ baja.organoSuperior }}</td>
                            <td>
                                <a :href="'/ruta/del/archivo/' + bajas.documentoAmpara" download>
                                    <button class="btn-download">
                                        <i class="fas fa-file-alt"></i> <!-- Icon for document -->
                                    </button>
                                </a>
                            </td>
                            <td>
                                <a :href="'/ruta/del/archivo/' + bajas.oficioSolicitud" download>
                                    <button class="btn-download">
                                        <i class="fas fa-file-signature"></i> <!-- Icon for signature or official letter -->
                                    </button>
                                </a>
                            </td>
                            <td>
                                <button @click="openModal(baja.fotoBien)" class="btn-download">
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
    name: "bajasPage",
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
                bajasMenu: false,
                settingsMenu: false,
                userMenu: false,
            },
            bajas: [
                {
                    numerobien: "12345",
                    descripcion: "Laptop HP ProBook",
                    modelo: "ProBook 450 G8",
                    marca: "HP",
                    serie: "5CD12345XYZ",
                    fechaBaja: "2024-01-15",
                    tipoBaja: "Robo",
                    unidadPresupuestal: "Radio y Televisión de Hidalgo",
                    organoSuperior: "Organismo Descentralizado",
                    documentoAmpara: "/path/to/documento.pdf",
                    oficioSolicitud: "/path/to/oficio.pdf",
                    fotoBien: ["radio-y-television-de-hidalgo.jpg", "radio.jpeg", "radio2.jpg", "radio-y-television-de-hidalgo.jpg", "radio-y-television-de-hidalgo.jpg", "document_download.png", "logo.png"]
                },
                {
                    numerobien: "67890",
                    descripcion: "Impresora Canon",
                    modelo: "PIXMA G6020",
                    marca: "Canon",
                    serie: "ABC67890DEF",
                    fechaBaja: "2024-01-20",
                    tipoBaja: "Donación",
                    unidadPresupuestal: "Radio y Televisión de Hidalgo",
                    organoSuperior: "Organismo Descentralizado",
                    documentoAmpara: "/path/to/documento2.pdf",
                    oficioSolicitud: "/path/to/oficio2.pdf",
                    fotoBien: ["radio-y-television-de-hidalgo.jpg", "radio.jpeg", "radio2.jpg", "radio-y-television-de-hidalgo.jpg", "radio-y-television-de-hidalgo.jpg", "document_download.png", "logo.png"]
                }
            ],
            itemsPerPage: 10,
            currentPage: 1,
            filterTerm: '',
            searchQuery: '',
            showModal: false,
            modalImages: [],
        };
    },
    computed: {
        filteredBajas() {
            return this.bajas.filter(baja => {
                const query = this.searchQuery.toLowerCase();
                return (
                    baja.numerobien.toLowerCase().includes(query) ||
                    baja.descripcion.toLowerCase().includes(query) ||
                    baja.modelo.toLowerCase().includes(query) ||
                    baja.marca.toLowerCase().includes(query) ||
                    baja.serie.toLowerCase().includes(query) ||
                    baja.tipoBaja.toLowerCase().includes(query)
                );
            });
        },
        totalPages() {
            return Math.ceil(this.filteredBajas.length / this.itemsPerPage);
        },
        paginatedBajas() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredBajas.slice(start, end);
        }
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
        redirectToAddbajas() {
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
        },
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

.bajas-table {
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

.bajas-table th,
.bajas-table td {
    padding: 10px;
    text-align: center;
}

.bajas-table th {
    background-color: #BC955B;
    color: white;
}

.bajas-table tr:hover {
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