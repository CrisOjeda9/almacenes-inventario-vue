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
                <h1>Solicitudes</h1>
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
            <a v-if="userRole === 'Administrador'" href="users" class="nav-item">Aministrador</a>
           <div v-if="userRole === 'Almacenes' || userRole === 'Administrador'" class="nav-item" @mouseenter="showMenu('almacenMenu')"
                @mouseleave="hideMenu('almacenMenu')">
                Almacén
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.almacenMenu">
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('existencia')">Entrada de artículos</button>
                    <button @click="navigateTo('articulos')">Existencias</button>
                    <button @click="navigateTo('solicitudmaterial')">Salida de material</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepción de solicitudes</button>
                    <button @click="navigateTo('poliza')">Pólizas</button>
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

        <div class="search-bar">
            <div class="input-wrapper">
                <input type="text" v-model="searchQuery" placeholder="Buscar..." />
                <i class="fas fa-search"></i>
            </div>
        </div>

        <div class="contenedor-tabla">
            <table class="solicitudes-table">
                <thead>
                    <tr>
                        <th>Numero de solicitud</th>
                        <th>Dirección Solicitante</th>
                        <th>Area</th>
                        <th>Fecha de Salida</th>
                        <th>N° Partida</th>
                        <th>Unidad Medida</th>
                        <th>Descripción del Material</th>
                        <th>Cantidad Entregada</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="solicitud in paginatedSolicitudes" :key="solicitud.id">
                        <td>{{ solicitud.numero_solicitud || 'N/A' }}</td>
                        <!-- Nueva columna para número de solicitud -->
                        <td>{{ solicitud.direccion_solicitante }}</td>
                        <td>{{ solicitud.area }}</td>
                        <td>{{ formatDate(solicitud.fechaSalida) }}</td>
                        <td>{{ solicitud.numeroPartida }}</td>
                        <td>{{ solicitud.unidadMedida }}</td>
                        <td>{{ solicitud.descripcionMaterial }}</td>
                        <td>{{ solicitud.cantidadEntregada }}</td>

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
</template>

<script>
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import api from '../services/api';

export default {
    name: "versolicitudesPage",
    data() {
        return {
            userRole: localStorage.getItem('userRole') || '',
            userName: "Cargando...",
            profileImage: "",
            menus: {
                homeMenu: false,
                solicitudMenu: false,
                settingsMenu: false,
                userMenu: false, 
            },
            searchQuery: '',
            solicitudes: [],
            articulos: [],
            combinedData: [],
            itemsPerPage: 10,
            currentPage: 1,
        };
    },
    computed: {
        filteredSolicitudes() {
            return this.combinedData.filter(item => {
                const query = this.searchQuery.toLowerCase();
                return (
                    item.direccion_solicitante.toLowerCase().includes(query) ||
                    item.area.toLowerCase().includes(query) ||
                    (item.numeroPartida && item.numeroPartida.toString().toLowerCase().includes(query)) ||
                    (item.descripcionMaterial && item.descripcionMaterial.toLowerCase().includes(query))
                );
            });
        },
        totalPages() {
            return Math.ceil(this.filteredSolicitudes.length / this.itemsPerPage);
        },
        paginatedSolicitudes() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredSolicitudes.slice(start, end);
        },
    },
    async mounted() {
        this.loadUserData();
        await this.cargarDatos();
    },
    methods: {
        async obtenerNombrePartida(numeroPartida) {
            try {
                const response = await api.get(`/objetoGastos?numero_partida=${numeroPartida}`);
                const partida = response.data[0];

                // Si no existe la partida
                if (!partida) {
                    return {
                        numero: numeroPartida,
                        nombre: `${numeroPartida}`,
                        mostrar: `Partida ${numeroPartida}`
                    };
                }

                // Determinar el nombre a mostrar
                let nombreMostrar;
                if (partida.nombre && partida.nombre !== 'string' && partida.nombre.trim() !== '') {
                    nombreMostrar = partida.nombre;
                } else {
                    nombreMostrar = `Partida ${partida.numero_partida}`;
                }

                return {
                    numero: partida.numero_partida,
                    nombre: partida.nombre,
                    mostrar: `${partida.numero_partida} - ${nombreMostrar}`
                };
            } catch (error) {
                console.error('Error al obtener datos de partida:', error);
                return {
                    numero: numeroPartida,
                    nombre: `Partida ${numeroPartida}`,
                    mostrar: `Partida ${numeroPartida}`
                };
            }
        },


        async generarPDF() {
            try {
                // Obtener datos de partidas
                const partidasResponse = await api.get('/objetoGastos');
                const todasLasPartidas = partidasResponse.data;

                // Agrupar solicitudes por partida
                const solicitudesPorPartida = {};
                this.filteredSolicitudes.forEach(solicitud => {
                    const partida = solicitud.numeroPartida || 'N/A';
                    if (!solicitudesPorPartida[partida]) {
                        solicitudesPorPartida[partida] = [];
                    }
                    solicitudesPorPartida[partida].push(solicitud);
                });

                // Crear PDF
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm'
                });

                // Configuración de tabla
                const headers = [
                    'N° Solicitud', 'Dirección', 'Fecha',
                    'Partida', 'Unidad', 'Descripción', 'Cantidad'
                ];

                const tableWidth = 15 + 30 + 20 + 15 + 15 + 60 + 15;
                const pageWidth = 210;
                const marginLeft = (pageWidth - tableWidth) / 2;

                const partidas = Object.keys(solicitudesPorPartida);

                // Función para agregar número de página
                const addPageNumber = (doc, totalPages) => {
                    const pageCount = doc.internal.getNumberOfPages();
                    for (let i = 1; i <= pageCount; i++) {
                        doc.setPage(i);
                        doc.setFontSize(8);
                        doc.text(`Página ${i} de ${totalPages}`, pageWidth / 2, 285, { align: 'center' });
                    }
                };

                // Primero generar todo el contenido
                doc.setFont('helvetica', 'bold');

                partidas.forEach((numeroPartida, index) => {
                    if (index > 0) {
                        doc.addPage();
                    }

                    const partidaInfo = todasLasPartidas.find(p => p.numero_partida === numeroPartida) || {
                        numero_partida: numeroPartida,
                        nombre: `Partida ${numeroPartida}`,
                        descripcion: ''
                    };

                    // Títulos
                    doc.setFontSize(14);
                    doc.text(`${partidaInfo.nombre}`, pageWidth / 2, 20, { align: 'center' });
                    doc.setFontSize(10);
                    doc.text(`Número de partida: ${partidaInfo.numero_partida}`, pageWidth / 2, 27, { align: 'center' });

                    // Tabla
                    doc.autoTable({
                        head: [headers],
                        body: solicitudesPorPartida[numeroPartida].map(solicitud => [
                            solicitud.numero_solicitud || 'N/A',
                            solicitud.direccion_solicitante,
                            solicitud.area,
                            this.formatDate(solicitud.fechaSalida),
                            solicitud.numeroPartida,
                            solicitud.unidadMedida,
                            solicitud.descripcionMaterial,
                            solicitud.cantidadEntregada
                        ]),
                        startY: 35,
                        margin: { left: marginLeft, right: marginLeft },
                        styles: { fontSize: 8, cellPadding: 2 },
                        headStyles: {
                            fillColor: [188, 149, 91],
                            textColor: [255, 255, 255],
                            fontStyle: 'bold'
                        },
                        columnStyles: {
                            0: { cellWidth: 15 }, 1: { cellWidth: 30 },
                            2: { cellWidth: 20 }, 3: { cellWidth: 15 },
                            4: { cellWidth: 15 }, 5: { cellWidth: 60 },
                            6: { cellWidth: 15 }
                        },
                        pageBreak: 'auto'
                    });
                });

                // Agregar números de página al final cuando sabemos el total
                const totalPages = doc.internal.getNumberOfPages();
                addPageNumber(doc, totalPages);

                doc.save('reporte_solicitudes.pdf');

            } catch (error) {
                console.error('Error al generar PDF:', error);
                alert('Error al generar el PDF');
            }
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('es-MX');
        },
        async loadUserData() {
            const storedUserName = localStorage.getItem("userName");
            const storedUserEmail = localStorage.getItem("userEmail");

            if (storedUserName && storedUserEmail) {
                this.userName = storedUserName;

                try {
                    const response = await api.get('/personas');
                    const users = response.data;
                    const user = users.find(u => u.email === storedUserEmail);

                    if (user) {
                        const fullName = `${user.nombre || storedUserName} ${user.apellidos || ""}`.trim();
                        this.userName = fullName;

                        const imagePath = user.imagen;
                        let imageFileName = imagePath.split('\\').pop();

                        if (imageFileName) {
                            imageFileName = imageFileName.split('.').slice(0, -1).join('.');
                            this.profileImage = `http://192.168.10.31:3000/api/users-files/${imageFileName}`;
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
        async cargarDatos() {
            try {
                // Cargar solicitudes
                const solicitudesResponse = await api.get('/solicitudes');
                this.solicitudes = solicitudesResponse.data;

                // Cargar artículos
                const articulosResponse = await api.get('/articulos');
                this.articulos = articulosResponse.data;

                // Combinar los datos y ordenar por fecha (más reciente primero)
                this.combinedData = this.solicitudes
                    .map(solicitud => {
                        const articulo = this.articulos.find(a => a.id === solicitud.id_articulo);

                        return {
                            id: solicitud.id,
                            numero_solicitud: solicitud.numero_solicitud,
                            direccion_solicitante: solicitud.direccion_solicitante,
                            area: solicitud.area,
                            fechaSalida: solicitud.createdAt, // Usamos createdAt que es la fecha de creación
                            numeroPartida: articulo ? articulo.id_objetogasto : 'N/A',
                            unidadMedida: articulo ? articulo.unidad_medida : 'N/A',
                            descripcionMaterial: articulo ? articulo.descripcion : 'N/A',
                            cantidadEntregada: solicitud.cantidad_entregada,
                            // Agregamos un campo timestamp para facilitar el ordenamiento
                            timestamp: new Date(solicitud.createdAt).getTime()
                        };
                    })
                    .sort((a, b) => b.timestamp - a.timestamp); // Orden descendente por fecha

            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        },
        goHome() {
            this.$router.push('home');
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

.download-buttons {
    margin: 20px 0;
    text-align: center;
}

.download-buttons button {
    width: 150px;
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
    background-color: red;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
}

.download-buttons button:hover {
    background-color: #e0a800;
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
    background: white;
    flex-direction: column;
    color: white;
    overflow-x: hidden;
    overflow-y: auto;
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

.solicitudes-table {
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

.solicitudes-table th,
.solicitudes-table td {
    padding: 10px;
    text-align: center;
}

.solicitudes-table th {
    background-color: #BC955B;
    color: white;
}

.solicitudes-table tr:hover {
    background-color: #70727265;
    color: #A02142;
    transition: background-color 0.3s ease;
}

.btn-existencias {
    width: 120px;
    text-align: center;
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 15px;
    padding-right: 15px;
    border: none;
    cursor: pointer;
}

.btn-existencias {
    background-color: #BC955B;
    color: white;
    margin-bottom: 4px;
}



.btn-existencias:hover {
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