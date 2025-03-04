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
                <h1>Bienes sin Resguardo</h1>
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
            <a v-if="userRole === 'Administrador'" href="users" class="nav-item">Usuarios</a>
            <div v-if="userRole === 'Inventario' || userRole === 'Administrador'" class="nav-item" @mouseenter="showMenu('homeMenu')" @mouseleave="hideMenu('homeMenu')">
                Inventario
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.homeMenu">
                    <button @click="navigateTo('bajas')">Historial de bajas</button>
                    <button @click="navigateTo('historialbienes')">Historial de bienes</button>
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')"
                        style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Bienes sin
                        resguardo</button>
                    <button @click="navigateTo('listaalmacen')">Asignar No.Inventario</button>
                    <button @click="navigateTo('bienesnuevos')">Asignar resguardo</button>
                    <button @click="navigateTo('liberarbien')">Liberar Bien</button>
                    <button @click="navigateTo('reportes')">Generación de reportes</button>



                </div>
            </div>

            <div v-if="userRole === 'Almacen' || userRole === 'Administrador'" class="nav-item" @mouseenter="showMenu('resguardoMenu')" @mouseleave="hideMenu('resguardoMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.resguardoMenu">
                    <button @click="navigateTo('solicitudmaterial')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('existencia')">Entrada de artículos</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('poliza')">Polizas</button>
                </div>
            </div>

        </div>

        <div class="search-bar">
            <div class="input-wrapper">
                <input type="text" v-model="searchQuery" placeholder="Buscar..." />
                <i class="fas fa-search"></i>
            </div>
        </div>
        <!-- Botones de descarga -->
        <div class="download-buttons">
            <button @click="downloadPDF" style="background-color: red;">
                <i class="fas fa-file-pdf" style="margin-right: 8px;"></i>
                Descargar PDF
            </button>
            <button @click="downloadExcel" style="background-color: green;">
                <i class="fas fa-file-excel" style="margin-right: 8px;"></i>
                Descargar Excel
            </button>
        </div>

        <div class="contenedor-tabla">
            <table class="resguardo-table">
                <thead>
                    <tr>
                        <th v-for="field in tableFields" :key="field.value">
                            <label>
                                <input type="checkbox" v-model="selectedFields" :value="field.value"> {{ field.label }}
                            </label>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="resguardo in paginatedResguardo" :key="resguardo.noinventario">
                        <td v-for="field in tableFields" :key="field.value">
                            <!-- Verificar si el campo es 'foto' y mostrar la imagen -->
                            <template v-if="field.value === 'foto'">
                                <button @click="openModal(resguardo.foto)" class="btn-download">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </template>
                            <template v-else>
                                {{ resguardo[field.value] }}
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
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
                            <img :src="getImageUrl(foto)" alt="Foto del bien" class="modal-img" />
                        </a>
                        <p class="image-name">{{ foto }}</p>
                    </div>
                </div>
                <button @click="closeModal">Cerrar</button>
            </div>
        </div>
    </div>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default {
    name: "resguardoPage",
    data() {
        return {
            userRole: localStorage.getItem('userRole') || '', // Obtener el rol desde el localStorage
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario

            menus: {
                homeMenu: false,
                resguardoMenu: false,
                settingsMenu: false,
            },
            searchQuery: '',
            selectedFields: ["noinventario", "descripcion", "color", "material", "modelo", "marca", "serie", "foto", "registrationDate"], // Añadir 'foto' en la selección
            tableFields: [
                { label: "No. Inventario", value: "noinventario" },
                { label: "Descripción", value: "descripcion" },
                { label: "Color", value: "color" },
                { label: "Material", value: "material" },
                { label: "Modelo", value: "modelo" },
                { label: "Marca", value: "marca" },
                { label: "Serie", value: "serie" },
                { label: "Foto", value: "foto" }, // Nueva columna para foto
                { label: "Fecha de Registro", value: "registrationDate" }
            ],
            resguardo: [
                { noinventario: "15051", descripcion: "es grande", color: "Rojo", material: "Marmol", modelo: "pro", marca: "apple", foto: ["radio-y-television-de-hidalgo.jpg", "radio.jpeg","radio2.jpg"], serie: "pro", registrationDate: "2024-01-15" },
                { noinventario: "15052", descripcion: "compacto", color: "Azul", material: "Aluminio", modelo: "mini", marca: "samsung", foto:["radio-y-television-de-hidalgo.jpg", "radio.jpeg","radio2.jpg"], serie: "mini", registrationDate: "2024-01-16" },
                { noinventario: "15053", descripcion: "elegante", color: "Negro", material: "Vidrio", modelo: "elegant", marca: "sony", foto: ["radio-y-television-de-hidalgo.jpg",  "radio.jpeg","radio2.jpg"], serie: "elegant", registrationDate: "2024-01-17" }
            ],
            itemsPerPage: 10, // Cantidad de elementos por página
            currentPage: 1, // Página actual
            showModal: false,
            modalImages: [],
            itemToRemove: null,

            getImageUrl(image) {
                return require(`@/assets/${image}`);
            },
        };
    },
    computed: {
        filteredResguardo() {
            return this.resguardo.filter(resguardo =>
                Object.values(resguardo).some(value =>
                    value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
                )
            );
        },
        paginatedResguardo() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredResguardo.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredResguardo.length / this.itemsPerPage);
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
                        // Asignar el nombre del usuario
                        this.userName = user.name || storedUserName;

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
        changePage(page) {
            if (page > 0 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        showMenu(menu) {
            this.menus[menu] = true;
        },
        hideMenu(menu) {
            this.menus[menu] = false;
        },
        navigateTo(route) {
            this.$router.push({ name: route });
        },
        goBack() {
            window.history.back();
        },
        downloadPDF() {
            const doc = new jsPDF();
            doc.text("Tabla de Resguardo", 14, 10);

            // Filtrar las columnas seleccionadas en el orden en que aparecen en tableFields
            const orderedSelectedFields = this.tableFields
                .filter(field => this.selectedFields.includes(field.value))
                .map(field => field.value);

            // Generar encabezados respetando el orden
            const headers = orderedSelectedFields.map(field =>
                this.tableFields.find(f => f.value === field).label
            );

            // Generar filas respetando el orden
            const data = this.filteredResguardo.map(resguardo =>
                orderedSelectedFields.map(field => resguardo[field])
            );

            doc.autoTable({
                head: [headers], // Encabezados en el orden correcto
                body: data, // Datos en el orden correcto
                headStyles: {
                    fillColor: '#691B31', // Color de fondo 
                    textColor: 255, // Blanco para el texto
                    fontStyle: 'bold', // Negrita en los encabezados
                    halign: 'center', // Alineación horizontal al centro
                    valign: 'middle', // Alineación vertical al medio
                }
            });

            doc.save("Tabla_resguardo.pdf");
        },



        downloadExcel() {
            // Filtrar las columnas seleccionadas en el orden en que aparecen en tableFields
            const orderedSelectedFields = this.tableFields
                .filter(field => this.selectedFields.includes(field.value))
                .map(field => field.value);

            // Crear encabezados en el orden correcto
            const headers = orderedSelectedFields.map(field =>
                this.tableFields.find(f => f.value === field).label
            );

            // Generar filas respetando el orden
            const data = this.filteredResguardo.map(resguardo =>
                orderedSelectedFields.map(field => resguardo[field])
            );

            // Crear la hoja de Excel con los encabezados y datos
            const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Resguardo');
            XLSX.writeFile(wb, 'Tabla_resguardo.xlsx');
        },


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
    redirectToAddUser() {
        // Aquí defines la ruta a la que quieres redirigir al hacer clic en el botón
        this.$router.push('/register');
    },
    changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    },

};

</script>

<style scoped>
/* Aplicar Montserrat a todo el contenido */
* {
    font-family: 'Montserrat', sans-serif;
}

.btn-download {
    width: 50px;
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
    overflow-x: hidden;
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

.resguardo-table {
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

.resguardo-table th,
.resguardo-table td {
    padding: 10px;
    text-align: center;
}

.resguardo-table th {
    background-color: #BC955B;
    color: white;
}

.resguardo-table tr:hover {
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
    margin: 20px 0;
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

.download-buttons {
    margin: 20px 0;
    text-align: center;
}

.download-buttons button {
    width: 150px;
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #f8c102;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
}

.download-buttons button:hover {
    background-color: #e0a800;
}
</style>