<template>
    <div class="page-wrapper">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        <NavBarPage :pageTitle="'Reportes'" :showUserMenu="true" />
        <div class="container">
            <div class="search-bar">
                <div class="input-wrapper">
                    <input type="text" v-model="searchQuery" placeholder="Buscar..." />
                    <i class="fas fa-search"></i> <!-- Icono de la lupa -->
                </div>
            </div>
            <!-- Contenedor de botones -->
            <div class="button-container">
                <button class="btn-report aseh">Generar reporte para ASEH</button>
                <button class="btn-report coin">Generar reporte para COIN</button>
                <button class="btn-report cuenta-publica">Generar reporte para cuenta pública</button>
                <button class="btn-report padron">Generar reporte para registro de padrón</button>
            </div>

            <div class="contenedor-tabla">
                <table class="reportes-table">
                    <thead>
                        <tr>
                            <th>Tipo de reporte</th>
                            <th>Fecha en que se generó el reporte</th>
                            <th>Usuario que generó el reporte</th>
                            <th>Descargar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="reporte in paginatedreportes" :key="reporte.id">
                            <td>{{ reporte.tipoReporte }}</td>
                            <td>{{ reporte.fechaGeneracion }}</td>
                            <td>{{ reporte.usuarioGenero }}</td>
                            <td>
                                <a :href="'/ruta/del/archivo/' + reporte.documentoExcel" download>
                                    <button class="btn-excel">
                                        <i class="fas fa-file-excel"></i>
                                    </button>
                                </a>
                                <a :href="'/ruta/del/archivo/' + reporte.documentoPdf" download>
                                    <button class="btn-pdf">
                                        <i class="fas fa-file-pdf"></i>
                                    </button>
                                </a>
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
import NavBarPage from './NavBar.vue';
export default {
    name: "ReportesPage",
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
                reportesMenu: false,
                settingsMenu: false,
                userMenu: false,
            },
            searchQuery: '',
            reportes: [
                { tipoReporte: "Reporte de ventas", fechaGeneracion: "2024-01-15", usuarioGenero: "admin", documentoExcel: "reporte_ventas_2024.pdf",documentoPdf: "reporte_ventas_2024.pdf"},
                { tipoReporte: "Reporte de inventario", fechaGeneracion: "2024-01-16", usuarioGenero: "user1", documentoExcel: "reporte_ventas_2024.pdf",documentoPdf: "reporte_ventas_2024.pdf"},
                { tipoReporte: "Reporte de gastos", fechaGeneracion: "2024-01-17", usuarioGenero: "user2", documentoExcel: "reporte_ventas_2024.pdf",documentoPdf: "reporte_ventas_2024.pdf"},
                // Agrega más reportes aquí...
            ],
            itemsPerPage: 10, // Cantidad de elementos por página
            currentPage: 1, // Página actual
        };
    },
    computed: {
        filteredReportes() {
            return this.reportes.filter(reporte => {
                const query = this.searchQuery.toLowerCase();
                return (
                    reporte.tipoReporte.toLowerCase().includes(query) ||
                    reporte.usuarioGenero.toLowerCase().includes(query)
                );
            });
        },
        totalPages() {
            return Math.ceil(this.filteredReportes.length / this.itemsPerPage);
        },
        paginatedreportes() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredReportes.slice(start, end);
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
        redirectToAddreportes() {
            this.$router.push('/register');
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

.reportes-table {
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

.reportes-table th,
.reportes-table td {
    padding: 10px;
    text-align: center;
}

.reportes-table th {
    background-color: #BC955B;
    color: white;
}

.reportes-table tr:hover {
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
.btn-excel, .btn-pdf {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%; /* Hace los botones completamente redondos */
    border: none;
    cursor: pointer;
    font-size: 18px;
    transition: background 0.3s ease;
    margin: 0 5px; /* Agrega un pequeño espacio entre los botones */
}

.btn-excel {
    background-color: #28a745; /* Verde */
    color: white;
}

.btn-excel:hover {
    background-color: #218838; /* Un tono más oscuro al pasar el cursor */
}

.btn-pdf {
    background-color: #dc3545; /* Rojo */
    color: white;
}

.btn-pdf:hover {
    background-color: #c82333; /* Un tono más oscuro al pasar el cursor */
}
.button-container {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin: 20px 0;
}

.btn-report {
    padding: 6px 12px; /* Se redujo el padding */
    width: auto; /* Se ajusta al contenido */
    min-width: 140px; /* Se establece un ancho mínimo para uniformidad */
    border: none;
    border-radius: 15px;
    font-size: 14px;
    font-weight: bold;
    color: white;
    cursor: pointer;
    transition: background 0.3s ease;
    text-align: center;
}

.aseh, .cuenta-publica {
    background-color: #BC955B;
}

.coin, .padron {
    background-color: #A02142;
}

.btn-report:hover {
    opacity: 0.8;
}

</style>