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
                <h1>Existencias</h1>
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
                <i class="fas fa-search"></i> <!-- Icono de la lupa -->
            </div>
            <div class="download-buttons">
                <button @click="generarPDFArticulos()">
                    <i class="fas fa-file-pdf"></i> Descargar PDF
                </button>
            </div>
        </div>

        <div class="contenedor-tabla">
            <div class="table-horizontal-scroll">
                <table class="existencia-table">
                    <thead>
                        <tr>
                            <th>Núm. partida</th>
                            <th>Descripcion</th>
                            <th>Cantidad</th>
                            <th>Unidad de medida</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="existencia in paginatedExistencias" :key="existencia.id">

                            <td>{{ getNumeroPartida(existencia.id_objetogasto) }}</td>
                            <td>{{ existencia.descripcion }}</td>
                            <td>{{ existencia.cantidad }}</td>
                            <td>{{ existencia.unidad_medida }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>    

            <!-- Modal de Edición -->
            <div v-if="isEditing" class="edit-modal">
                <div class="modal-content">
                    <h3>Editar Existencia</h3>
                    <form @submit.prevent="saveChanges" class="edit-form">
                        <div class="contenedorformulario">
                            <!-- Primera columna -->
                            <div class="form-column">
                                <div>
                                    <label>Número de factura:</label>
                                    <input v-model="currentExistencia.id_factura" type="text" />
                                </div>
                                <div>
                                    <label>Número de partida:</label>
                                    <input v-model="currentExistencia.id_objetogasto" type="text" />
                                </div>
                                <div>
                                    <label>Descripcion:</label>
                                    <input v-model="currentExistencia.descripcion" type="text" />
                                </div>
                            </div>

                            <!-- Segunda columna -->
                            <div class="form-column">
                                <div>
                                    <label>Precio Unitario:</label>
                                    <input v-model="currentExistencia.precio_unitario" type="text" />
                                </div>
                                <div>
                                    <label>IVA:</label>
                                    <input v-model="currentExistencia.iva" type="text" />
                                </div>
                                <div>
                                    <label>Importe con IVA:</label>
                                    <input v-model="currentExistencia.importe_con_iva" type="text" />
                                </div>
                                <label for="foto_articulo">Foto artículo</label>
                                <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent
                                    @click="triggerFileInput">
                                    <input type="file" id="updatefoto_articulo" ref="fileInput"
                                        @change="handleFileChange" accept="image/*" multiple style="display: none;" />
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <span v-if="currentExistencia.foto_articulo.length === 0">Arrastra o selecciona
                                        imágenes (JPG, PNG)</span>
                                    <span v-else>{{ currentExistencia.foto_articulo.length }} imágenes
                                        seleccionadas</span>
                                </div>
                                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                                <button v-if="currentExistencia.foto_articulo.length > 0"
                                    @click.prevent="openImageModal" class="view-images-btn">
                                    Ver Imágenes
                                </button>
                            </div>

                            <!-- Tercera columna -->
                            <div class="form-column">
                                <div>
                                    <label>Cantidad:</label>
                                    <input v-model="currentExistencia.cantidad" type="text" />
                                </div>
                                <div>
                                    <label>Unidad de medida:</label>
                                    <select v-model="currentExistencia.unidad_medida" class="form-input">
                                        <option value="" disabled>Selecciona una opción</option>
                                        <option value="piezas">Piezas</option>
                                        <option value="paquetes">Paquetes</option>
                                        <option value="cajas">Cajas</option>
                                        <option value="kilogramos">Kilogramos</option>
                                        <option value="litros">Litros</option>
                                        <option value="metros">Metros</option>
                                        <option value="rollos">Rollos</option>
                                        <option value="bultos">Bultos</option>
                                    </select>
                                </div>

                                <div>
                                    <label>Total de ingreso:</label>
                                    <input v-model="currentExistencia.total_ingreso" type="text" />
                                </div>
                            </div>
                        </div>

                        <!-- Botones debajo del formulario -->
                        <div class="form-buttons">
                            <button type="submit" class="save-btn">Guardar cambios</button>
                            <button @click="cancelEdit" type="button" class="cancel-btn">Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Modal para mostrar las imágenes seleccionadas -->
            <div v-if="showImageModal" class="modal-overlay3">
                <div class="modal3">
                    <h2>Imágenes seleccionadas</h2>
                    <div class="image-preview-container3">
                        <div v-for="(img, index) in currentExistencia.foto_articulo" :key="index"
                            class="image-preview3">
                            <div class="image-container3">
                                <img :src="getImageUrl(img)" :alt="img.name" class="image-preview-img3" />
                                <button @click="removeImage(index)" class="remove-btn">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                            <p class="image-name3">{{ img.name }}</p>
                        </div>
                    </div>
                    <button @click="closeImageModal">Cerrar</button>
                </div>
            </div>

            <!-- Modal de Confirmación de Eliminación -->
            <div v-if="isDeleteModalVisible" class="modal-overlay">
                <div class="modal-content-delete">
                    <h3>¿Estás seguro de eliminar esta existencia?</h3>
                    <div class="modal-buttons">
                        <button @click="confirmDelete" class="btn-confirm">Confirmar</button>
                        <button @click="cancelDelete" class="btn-cancel">Cancelar</button>
                    </div>
                </div>
            </div>


            <!-- Paginación -->
            <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
                <span>Pagina {{ currentPage }} de {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
            </div>
        </div>

        <!-- Modal para mostrar imágenes -->
        <div v-if="showModal" class="modal-overlay2" @click="closeModal">
            <div class="modal2" @click.stop>
                <h2>Imágenes</h2>
                <hr>
                <div class="image-container2">
                    <div v-for="(foto, i) in modalImages" :key="i" class="image-box">
                        <a :href="getImageUrl(foto)" target="_blank">
                            <img :src="getImageUrl(foto)" alt="Foto del bien recibido" class="modal-img2" />
                        </a>
                        <p class="image-name2">{{ foto }}</p>
                    </div>
                </div>
                <button @click="closeModal">Cerrar</button>
            </div>
        </div>
        <!-- Contenedor de notificaciones -->
        <div v-if="alertMessage" :class="alertClass" class="notification">
            <i :class="alertIcon"></i> {{ alertMessage }}
        </div>
    </div>
</template>


<script>
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import logoDorado from '../assets/RTH Y ESCUDO_Mesa de trabajo 1.png';
import api from '../services/api';


export default {
    name: "articulosPage",
    data() {
        return {
            alertMessage: "",
            alertClass: "",
            alertIcon: "",
            userRole: localStorage.getItem('userRole') || '',
            userName: "Cargando...",
            profileImage: "",
            inventario: [],
            menus: {
                homeMenu: false,
                existenciaMenu: false,
                settingsMenu: false,
                userMenu: false,
            },
            searchQuery: '',
            currentPage: 1,
            existenciasPerPage: 10,
            existencias: [],
            objetosGasto: [],
            isLoading: true,
        };
    },
    computed: {
        // Agrupar productos por descripción y sumar cantidades
        groupedExistencias() {
            const grouped = {};
            
            this.existencias.forEach(existencia => {
                const key = existencia.descripcion?.toLowerCase() || '';
                
                if (grouped[key]) {
                    // Si ya existe, sumar la cantidad
                    grouped[key].cantidad = (parseFloat(grouped[key].cantidad) + parseFloat(existencia.cantidad || 0)).toString();
                } else {
                    // Si no existe, crear nueva entrada
                    grouped[key] = {
                        id: existencia.id,
                        numero_partida: this.getNumeroPartida(existencia.id_objetogasto),
                        descripcion: existencia.descripcion,
                        cantidad: existencia.cantidad || '0',
                        unidad_medida: existencia.unidad_medida,
                        id_objetogasto: existencia.id_objetogasto
                    };
                }
            });
            
            return Object.values(grouped);
        },
        
        filteredExistencias() {
            const query = this.searchQuery.toLowerCase();
            return this.groupedExistencias.filter(existencia => {
                return (
                    existencia.numero_partida?.toLowerCase().includes(query) ||
                    existencia.descripcion?.toLowerCase().includes(query) ||
                    existencia.cantidad?.toLowerCase().includes(query) ||
                    existencia.unidad_medida?.toLowerCase().includes(query)
                );
            });
        },
        
        totalPages() {
            return Math.ceil(this.filteredExistencias.length / this.existenciasPerPage);
        },
        
        paginatedExistencias() {
            const start = (this.currentPage - 1) * this.existenciasPerPage;
            const end = start + this.existenciasPerPage;
            return this.filteredExistencias.slice(start, end);
        }
    },
    mounted() {
        this.loadUserData();
        this.initializeData();
        this.loadObjetosGasto();
    },
    methods: {
        async generarPDFArticulos() {
            try {
                // Función para convertir imagen a base64
                const getImageBase64 = (imageUrl) => {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.crossOrigin = 'anonymous';
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);
                            const dataURL = canvas.toDataURL('image/png');
                            resolve(dataURL);
                        };
                        img.onerror = (error) => {
                            console.warn('No se pudo cargar el logo, continuando sin él', error);
                            resolve(null);
                        };
                        img.src = imageUrl;
                    });
                };


                // Cargar el logo
                let logoBase64 = null;
                try {
                    logoBase64 = await getImageBase64(logoDorado);
                } catch (error) {
                    console.warn('Error al cargar el logo:', error);
                }

                // Crear PDF
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm'
                });

                // Configuración de tabla
                const headers = [
                    'N° Partida','Descripción', 'Cantidad', 'Unidad'
                ];

                // Agrupar existencias por número de partida
                const existenciasPorPartida = {};
                this.filteredExistencias.forEach(existencia => {
                    const numeroPartida = existencia.numero_partida || 'Sin Partida';
                    if (!existenciasPorPartida[numeroPartida]) {
                        existenciasPorPartida[numeroPartida] = [];
                    }
                    existenciasPorPartida[numeroPartida].push(existencia);
                });

                // Ordenar las partidas
                const partidasOrdenadas = Object.keys(existenciasPorPartida).sort();

                // Configuración de diseño
                const pageWidth = 210;
                const tableWidth = 40 + 80 + 30 + 30; // Ancho total de la tabla
                const marginLeft = (pageWidth - tableWidth) / 2;

                let isFirstPage = true;

                // Función para agregar encabezado con logo a cada página
                const addHeader = (doc) => {
                    // Agregar logo en la esquina superior derecha si está disponible
                    if (logoBase64) {
                        const logoWidth = 40; // Ancho del logo en mm
                        const logoHeight = 15; // Alto del logo en mm
                        const logoX = pageWidth - logoWidth - 10; // 10mm de margen derecho
                        const logoY = 8; // 8mm desde la parte superior
                        
                        doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
                    }

                    // Título principal
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(16);
                    doc.text('REPORTE DE ARTÍCULOS DISPONIBLES', pageWidth / 2, 30, { align: 'center' });
                    
                    
                    // Fecha del reporte
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    const fechaActual = new Date().toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    doc.text(`Fecha: ${fechaActual}`, pageWidth / 2, 35, { align: 'center' });
                };

                // Generar una página para cada partida
                partidasOrdenadas.forEach((numeroPartida) => {
                    if (!isFirstPage) {
                        doc.addPage();
                    }
                    isFirstPage = false;

                    // Agregar encabezado con logo
                    addHeader(doc, numeroPartida);

                    const articulosPartida = existenciasPorPartida[numeroPartida];
                    
                    // Calcular total de la partida
                    const totalPartida = articulosPartida.reduce((total, existencia) => {
                        return total + parseFloat(existencia.cantidad || 0);
                    }, 0);

                    // Información de la partida
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    doc.text(`Tipos de artículos en esta partida: ${articulosPartida.length}`, 20, 50);
                    doc.text(`Cantidad total: ${totalPartida.toFixed(2)}`, 20, 56);

                    // Tabla de artículos de la partida
                    doc.autoTable({
                        head: [headers],
                        body: articulosPartida.map(existencia => [
                            existencia.numero_partida || 'N/A',
                            existencia.descripcion || 'Sin descripción',
                            parseFloat(existencia.cantidad || 0).toFixed(2),
                            existencia.unidad_medida || 'N/A'
                        ]),
                        startY: 65,
                        margin: { left: marginLeft, right: marginLeft },
                        styles: { 
                            fontSize: 9, 
                            cellPadding: 3,
                            halign: 'center'
                        },
                        headStyles: {
                            fillColor: [188, 149, 91],
                            textColor: [255, 255, 255],
                            fontStyle: 'bold',
                            halign: 'center'
                        },
                        columnStyles: {
                            0: { cellWidth: 25, halign: 'center' }, // N° Partida
                            1: { cellWidth: 100, halign: 'left' },   // Descripción
                            2: { cellWidth: 30, halign: 'right' },   // Cantidad
                            3: { cellWidth: 30, halign: 'center' }   // Unidad
                        },
                        alternateRowStyles: {
                            fillColor: [245, 245, 245]
                        },
                        pageBreak: 'auto',
                        showHead: 'firstPage',
                        didDrawPage: function (data) {
                            // Agregar logo en páginas adicionales si la tabla se divide
                            if (data.pageNumber > 1 && logoBase64) {
                                const logoWidth = 25;
                                const logoHeight = 15;
                                const logoX = pageWidth - logoWidth - 10;
                                const logoY = 8;
                                
                                doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
                            }
                        }
                    });

                    // Agregar resumen al final de cada partida
                    let finalY = doc.lastAutoTable.finalY + 10;
                    
                    // Verificar si hay espacio para el resumen
                    if (finalY > 250) {
                        doc.addPage();
                        // Agregar logo en la nueva página
                        if (logoBase64) {
                            const logoWidth = 25;
                            const logoHeight = 15;
                            const logoX = pageWidth - logoWidth - 10;
                            const logoY = 8;
                            
                            doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
                        }
                        finalY = 30;
                    }
                });

                // Función para agregar número de página
                const addPageNumber = (doc) => {
                    const pageCount = doc.internal.getNumberOfPages();
                    for (let i = 1; i <= pageCount; i++) {
                        doc.setPage(i);
                        doc.setFontSize(8);
                        doc.setFont('helvetica', 'normal');
                        doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, 285, { align: 'center' });
                    }
                };

                // Agregar números de página
                addPageNumber(doc);

                // Guardar el PDF
                const fileName = `reporte_articulos_${new Date().toISOString().split('T')[0]}.pdf`;
                doc.save(fileName);

                // Mostrar mensaje de éxito
                this.showAlert('PDF enerado exitosamente con separación por partidas', 'success');

            } catch (error) {
                console.error('Error al generar PDF:', error);
                this.showAlert('Error al generar el PDF', 'error');
            }
        },
        showAlert(message, type) {
            this.alertMessage = message;
            if (type === "success") {
                this.alertClass = "alert-success";
                this.alertIcon = "fa fa-check-circle";
            } else if (type === "error") {
                this.alertClass = "alert-error";
                this.alertIcon = "fa fa-times-circle";
            } else {
                this.alertClass = "alert-warning";
                this.alertIcon = "fa fa-exclamation-circle";
            }

            setTimeout(() => {
                this.alertMessage = "";
            }, 3000);
        },

        async initializeData() {
            try {
                await this.loadInventario();
                await this.loadExistencias();
            } catch (error) {
                console.error('Error al inicializar los datos:', error);
                this.isLoading = false;
            }
        },

        async loadInventario() {
            try {
                const response = await api.get('/inventario');
                this.inventario = response.data;
            } catch (error) {
                console.error('Error al cargar el inventario:', error);
                this.inventario = [];
            }
        },

        async loadExistencias() {
            try {
                const response = await api.get('/articulos');
                
                const articulosEnInventario = this.inventario.map(item => item.id_articulo);
                const articulosFiltrados = response.data.filter(articulo => {
                    return !articulosEnInventario.includes(articulo.id);
                });
                
                this.existencias = articulosFiltrados.sort((a, b) => a.id_objetogasto - b.id_objetogasto);
                
            } catch (error) {
                console.error('Error al cargar los artículos:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async loadObjetosGasto() {
            try {
                const response = await api.get('/objetoGastos');
                this.objetosGasto = response.data;
            } catch (error) {
                console.error('Error al cargar los objetos de gasto:', error);
            }
        },

        getNumeroPartida(idObjetogasto) {
            const objetoGasto = this.objetosGasto.find(
                (objeto) => objeto.id === idObjetogasto
            );
            return objetoGasto ? objetoGasto.numero_partida : "N/A";
        },

        async loadUserData() {
            const storedUserName = localStorage.getItem("userName");
            const storedUserEmail = localStorage.getItem("userEmail");

            if (storedUserName && storedUserEmail) {
                this.userName = storedUserName;

                try {
                    const response = await api.get('/personas');
                    const users = await response.json();
                    const user = users.find(u => u.email === storedUserEmail);

                    if (user) {
                        const fullName = `${user.nombre || storedUserName} ${user.apellidos || ""}`.trim();
                        this.userName = fullName;

                        const imagePath = user.imagen;
                        let imageFileName = imagePath?.split('\\').pop();

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

        async addToInventario(existencia) {
            localStorage.setItem('articuloId', existencia.id);
            this.selectedArticuloId = existencia.id;
            
            this.$router.push({
                name: 'bieninventario',
                params: { 
                    articuloId: existencia.id
                }
            });
        },

        async refreshData() {
            this.isLoading = true;
            await this.loadInventario();
            await this.loadExistencias();
        },

        goHome() {
            this.$router.push('home');
        },

        showMenu(menu) {
            this.menus[menu] = true;
        },

        hideMenu(menu) {
            this.menus[menu] = false;
        },

        navigateTo(page) {
            this.$router.push({ name: page });
        },

        goBack() {
            window.history.back();
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },

        redirectToAddExistencia() {
            this.$router.push('/newexistencia');
        }
    }
};
</script>


<style scoped>
/* Aplicar Montserrat a todo el contenido */
* {
    font-family: 'Montserrat', sans-serif;
}



/* Estilo general para la notificación */
.notification {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    color: white;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 999;
    max-width: 80%;
    opacity: 0;
    animation: fadeIn 0.5s forwards;
}

/* Animación de aparición de la notificación */
@keyframes fadeIn {
    0% {
        opacity: 0;
        top: 0;
    }

    100% {
        opacity: 1;
        top: 20px;
    }
}

/* Notificación de éxito */
.alert-success {
    background-color: #4CAF50;
    /* Verde */
}

/* Notificación de error */
.alert-error {
    background-color: #f44336;
    /* Rojo */
}

/* Notificación de advertencia */
.alert-warning {
    background-color: #ff9800;
    /* Naranja */
}

/* Iconos de la alerta */
.notification i {
    margin-right: 10px;
}

input[type="text"],
input[type="date"] {
    padding: 8px;
    border-radius: 25px;
    border: 1px solid #ccc;
}

.btn-download {
    width: 50px;
}


.image-preview-container3 {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.image-preview3 {
    text-align: center;
    position: relative;
    /* Esto es necesario para posicionar el botón dentro de la imagen */
}

.image-container3 {
    position: relative;
}

.image-preview-img3 {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
}

.remove-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    width: auto;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 0px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 25px;
}

.remove-btn i {
    font-size: 14px;
    /* Ajusta el tamaño del ícono dentro del botón */
}

.remove-btn:hover {
    background-color: rgba(0, 0, 0, 0.7);
}

.image-name3 {
    font-size: 12px;
    color: #333;
    margin-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
}



.view-images-btn {
    display: flex;
    justify-content: center;
    position: relative;
    width: 90%;
    background-color: #691b31;
    color: white;
    border: none;
    padding: 5px;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 2px;
    font-size: 15px;
}


.modal-overlay3 {
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

.modal3 {
    background: white;
    color: #691B31;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
}

.modal-overlay3.show {
    visibility: visible;
}

.modal3 button {
    padding: 10px 20px;
    background-color: #BC955B;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.modal3 button:hover {
    background-color: #691B31;
}









.image-container2 {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    /* Muestra 5 imágenes por fila */
    gap: 10px;
    /* Espacio entre las imágenes */
    margin-top: 20px;
}

.image-name2 {
    font-size: 12px;
    color: #333;
    margin-top: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;

}


.modal-img2 {
    max-width: 300px;
    border-radius: 8px;
    width: auto;
    height: 120px;

}


/* Efecto de zoom al pasar el cursor por encima de la imagen */
.modal-img2:hover {
    transition: transform 0.3s ease-in-out;
    transform: scale(1.1);
    box-shadow: 0 4px 8px #6f7271;
    /* Hace que la imagen crezca al 150% de su tamaño */
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
    width: 1100px;
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
    cursor: pointer;
}

.modal2 button:hover {
    background-color: #691B31;
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

.existencia-table {
     width: 100%;
    /* Ocupa todo el ancho disponible */
    max-width: 1200px;
    /* Limita el ancho máximo */
    border-collapse: separate;
    border-spacing: 0;
    background-color: white;
    color: #691B31;
    font-size: 16px;
    border-radius: 15px;
    overflow: hidden;
    table-layout: auto;
    /* Ajusta el ancho según el contenido */
}

.existencia-table th,
.existencia-table td {
    padding: 10px;
    text-align: center;
}

.existencia-table th {
    background-color: #BC955B;
    color: white;
}

.existencia-table tr:hover {
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
    max-width: 90px;
}

.btn-edit {
    background-color: #4CAF50;
    color: white;
    margin-bottom: 4px;
    width: 100%;
}

.btn-delete {
    background-color: #f44336;
    color: white;
    width: 100%;

}

.btn-edit:hover {
    background-color: #45a049;
}

.btn-delete:hover {
    background-color: #e41f1f;
}

.contenedor-tabla {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
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



.add-existencia-btn {
    margin-left: 50px;
    width: 60px;
    height: 60px;
    background-color: #bc955b;
    color: white;
    border: none;
    padding: 8px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
}

.add-existencia-btn:hover {
    background-color: #a4733a;
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

/* Estilos generales */
.edit-modal {
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
    color: white;
    text-align: center;
    font-size: 30px;
    background: #691B31;
    padding: 10px;
    border-radius: 25px;
    width: 100%;
    max-width: 1050px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
}


.contenedorformulario {
    display: flex;
    justify-content: center;
    align-items: center;
}

form .form-column {
    align-items: center;
}



.form-column {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 48%;


}

.form-column input {
    background-color: #dcdcdc;
    color: #691B31;
    width: 300px;
}

.form-column label {
    color: white;
}

input[type="text"],
input[type="date"] {
    padding: 8px;
    border-radius: 25px;
    border: 1px solid #ccc;
}



button[type="submit"] {
    background-color: #4CAF50;
}

button[type="button"] {
    background-color: #f44336;
}

.form-buttons button:hover {
    background-color: #45a049;
}

button[type="button"]:hover {
    background-color: #d32f2f;
}

.form-buttons {
    margin-top: 30px;
    margin-bottom: 10px;
    display: flex;
    height: 50px;
    width: 100%;
    justify-content: center;
    gap: 20px;

}

.form-buttons button {
    width: 30%;
}

/* Estilos del modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal-content-delete {
    font-size: 25px;
    background: #691B31;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    text-align: center;
    padding-bottom: 40px;
}

.modal-buttons {
    margin-top: 20px;
}

.btn-confirm,
.btn-cancel {
    padding: 10px;
    margin: 5px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn-confirm {
    background-color: green;
    color: white;
}

.btn-cancel {
    background-color: red;
    color: white;
}


.form-column select {
    background-color: #dcdcdc;
    color: #691B31;
    border-radius: 25px;
    width: 315px;
    height: 35px;
}


/* Estilos del Dropzone */
.dropzone {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px dashed #98989A;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s ease;
    min-width: 300px;
    /* Ocupa todo el ancho disponible */
    max-width: 300px;
    /* Ocupa todo el ancho disponible */
    min-height: 100px;
    /* Mantiene una altura mínima */
    max-height: 100px;
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

.dropzone i {
    font-size: 30px;
    color: #6F7271;
}

.dropzone span {
    font-size: 12px;
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
.table-horizontal-scroll {
    overflow-x: auto; /* Scroll horizontal */
    overflow-y: visible; /* Sin scroll vertical */
    border-radius: 15px;
    /* Agregar estas propiedades para forzar el scroll */
    display: block;
    white-space: break-word; /* Evitar que el contenido se ajuste */
}
@media (max-width: 768px) {
   
    
    .table-horizontal-scroll {
        max-width: calc(100vw - 20px); /* Considerar el padding */
    }
    
    .existencia-table {
        min-width: 1000px;
    }
    
    .existencia-table th,
    .existencia-table td {
        padding: 8px 6px;
        font-size: 14px;
        min-width: 80px; /* Reducir un poco el ancho mínimo */
    }
}

@media (max-width: 480px) {
   
    
    .table-horizontal-scroll {
        max-width: calc(100vw - 10px);
    }
    
    .existencia-table {
        min-width: 900px;
    }
    
    .existencia-table th,
    .existencia-table td {
        padding: 6px 4px;
        font-size: 12px;
        min-width: 70px;
    }
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

</style>