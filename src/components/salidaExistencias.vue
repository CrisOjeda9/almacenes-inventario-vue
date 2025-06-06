<template>
    <div class="page-wrapper">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        <NavBarPage :pageTitle="'Salida de existencias'" :showUserMenu="true" />
        <div class="container">
            <div class="contenedor-tabla">
                <!-- Nombre del usuario encima de la tabla -->
                <div class="contenedor-nombre">
                    <div class="user-info-display">
                        <h3>{{ userName }}</h3>
                    </div>
                </div>
                <table class="bajas-table">
                    <thead>
                        <tr>
                            <th>Cantidad solicitada</th>
                            <th>Unidad de medida</th>
                            <th>Descripción del material solicitado</th>
                            <th>Cantidad a entregar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="bajas in paginatedBajas" :key="bajas.id">
                            <td>{{ bajas.cantidadSolicitada }}</td>
                            <td>{{ bajas.unidadMedida }}</td>
                            <td>{{ bajas.descripcionMaterial }}</td>
                            <td>
                                <input type="number" min="0" v-model="bajas.cantidadEntregar" class="input-edit" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="button-container">
                    <button class="boton" type="button" @click="enviarSolicitud">
                        <i class="fas fa-paper-plane"></i> Enviar
                    </button>
                </div>

                <div v-if="showModal" class="modal">
                    <div class="modal-content">
                        <h2>Enviado con éxito</h2>
                        <p>La existencia a sido enviada correctamente.</p> 
                        <button @click="cerrarModal">Aceptar</button>
                    </div>
                </div>
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
import NavBarPage from './NavBar.vue';
export default {
    name: "salidaExistenciasPage",
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
            searchQuery: '',
            bajas: [
                { cantidadSolicitada: 10, unidadMedida: 'kg', descripcionMaterial: 'Material A', cantidadEntregar: 5 },
                { cantidadSolicitada: 20, unidadMedida: 'm', descripcionMaterial: 'Material B', cantidadEntregar: 8 },
                { cantidadSolicitada: 15, unidadMedida: 'l', descripcionMaterial: 'Material C', cantidadEntregar: 3 },
            ],
            itemsPerPage: 10,
            currentPage: 1,
            filterTerm: '',
            showModal: false,

        };
    },
    computed: {
        filteredBajas() {
            return this.bajas.filter(bajas => {
                const query = this.searchQuery.toLowerCase();
                return bajas.descripcionMaterial.toLowerCase().includes(query) ||
                    bajas.unidadMedida.toLowerCase().includes(query);
            });
        },
        totalPages() {
            return Math.ceil(this.filteredBajas.length / this.itemsPerPage);
        },
        paginatedBajas() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredBajas.slice(start, end);
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
        goHome() {
            this.$router.push('home');
        },
        goBack() {
            console.log("Regresar a la página anterior");
        },
        navigateTo(page) {
            console.log(`Navegando a ${page}`);
            this.$router.push({ name: page });
        },
        showMenu(menu) {
            this.menus[menu] = true;
        },
        hideMenu(menu) {
            this.menus[menu] = false;
        },
        changePage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        enviarSolicitud() {
            console.log("Solicitud enviada");
            this.showModal = true;
        },
        cerrarModal() {
            this.showModal = false;
            this.$router.push('/versolicitudes');
        }
    },
};

</script>


<style scoped>
/* Aplicar Montserrat a todo el contenido */
* {
    font-family: 'Montserrat', sans-serif;
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

.user-info-display {
    text-align: center;
    width: 200px;
    height: 60px;
    background-color: white;
    margin-bottom: 20px;
    font-size: 15px;
    font-weight: bold;
    color: #691B31;
    border-radius: 20px;
}

.contenedor-nombre {
    display: flex;
    width: 80%;
    height: 60px;
    margin-bottom: 10px;
}

.contenedor-tabla {
    display: flex;
    align-items: left;
}

.input-edit {
    text-align: center;
    border: none;
    background-color: #dcdcdc;
    color: #691B31;
    border-radius: 5px;
    padding: 5px;
    width: 100px;
    box-sizing: border-box;
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
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 20px;
}

.boton {
    width: 400px;

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

.contenedor-tabla {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>