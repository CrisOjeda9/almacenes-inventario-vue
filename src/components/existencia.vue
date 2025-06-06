<template>
    <div class="page-wrapper">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        <NavBarPage :pageTitle="'Artículos'" :showUserMenu="true" />
        <div class="container">
            <div class="search-bar">
                <div class="input-wrapper">
                    <input type="text" v-model="searchQuery" placeholder="Buscar..." />
                    <i class="fas fa-search"></i> <!-- Icono de la lupa -->
                </div>

                <!-- Botón para agregar nuevo usuario -->
                <button class="add-existencia-btn" @click="redirectToAddExistencia">
                    <i class="fas fa-file-invoice"></i> <i class="fas fa-plus"></i>
                </button>
            </div>

            <div class="contenedor-tabla">
                <div class="table-horizontal-scroll">
                    <table class="existencia-table">
                        <thead>
                            <tr>
                                <th>Núm. factura</th>
                                <th>Núm. partida</th>
                                <th>Descripcion</th>
                                <th>Precio Unitario</th>
                                <th>IVA</th>
                                <th>Importe con IVA</th>
                                <th>Cantidad</th>
                                <th>Unidad de medida</th>
                                <th>Total de ingreso</th>
                                <th>Foto artículo</th>
                                <th>Fecha de registro</th>
                                <th>Acciones</th>
                                <th>Agregar Inventario</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="existencia in paginatedExistencias" :key="existencia.id">

                                <td>{{ getNumeroFactura(existencia.id_factura) }}</td>
                                <td>{{ getNumeroPartida(existencia.id_objetogasto) }}</td>
                                <td>{{ existencia.descripcion }}</td>
                                <td>{{ existencia.precio_unitario }}</td>
                                <td>{{ existencia.iva }}</td>
                                <td>{{ existencia.importe_con_iva }}</td>
                                <td>{{ existencia.cantidad }}</td>
                                <td>{{ existencia.unidad_medida }}</td>
                                <td>{{ existencia.total_ingreso }}</td>
                                <td>
                                    <button @click="openModal(existencia.foto_articulo)" class="btn-download">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </td>
                                <td>{{ formatDate(existencia.createdAt) }}</td>
                                <td>
                                    <button @click="editExistencia(existencia)" class="btn-edit">Editar</button>
                                    <button @click="showDeleteModal(existencia.id)" class="btn-delete">Eliminar</button>
                                </td>
                                <td> 
                                    <button @click="addToInventario(existencia)" class="btn-inventario">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </td>
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
    </div>    
</template>

<script>
import api from '../services/api';
import NavBarPage from './NavBar.vue';

export default {
    name: "existenciaPage",
    components: {
        NavBarPage // Registrar el componente
    },
    data() {
        return {
            alertMessage: "",  // Mensaje de la alerta
            alertClass: "",    // Clase de la alerta (ej. 'success' o 'error')
            alertIcon: "",     // Icono para la alerta
            userRole: localStorage.getItem('userRole') || '', // Obtener el rol desde el localStorage
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario
            isDeleteModalVisible: false,
            selectedArticuloId: null,
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
            showModal: false,
            modalImages: [],
            itemToRemove: null,
            isEditing: false,
            currentExistencia: {
                foto_articulo: [],
            },
            errorMessage: "",
            showImageModal: false,
            existencias: [], // Lista de artículos obtenidos de la API
            objetosGasto: [],
            facturas: [],
            deleteId: null, // ID del artículo a eliminar
            isLoading: true, // Indicador de carga
            imagesToDelete: [], // Lista temporal de imágenes a eliminar

        };
    },
    computed: {
        filteredExistencias() {
            const query = this.searchQuery.toLowerCase();
            return this.existencias.filter(existencia => {
                return (
                    existencia.numero_factura?.toLowerCase().includes(query) || // Usar encadenamiento opcional
                    existencia.numero_partida?.toLowerCase().includes(query) || // Usar encadenamiento opcional
                    existencia.precio_unitario?.toLowerCase().includes(query) || // Usar encadenamiento opcional
                    existencia.total_iva?.toLowerCase().includes(query) || // Usar encadenamiento opcional
                    existencia.importe_con_iva?.toLowerCase().includes(query) || // Usar encadenamiento opcional
                    existencia.cantidad?.toLowerCase().includes(query) || // Usar encadenamiento opcional
                    existencia.unidad_medida?.toLowerCase().includes(query) || // Usar encadenamiento opcional
                    existencia.total_ingreso?.toLowerCase().includes(query) || // Usar encadenamiento opcional
                    existencia.fecha_registro?.toLowerCase().includes(query) || // Usar encadenamiento opcional
                    existencia.descripcion?.toLowerCase().includes(query)      // Usar encadenamiento opcional
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
        this.loadFacturas();
    },
    methods: {
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

            // Ocultar la alerta después de 3 segundos
            setTimeout(() => {
                this.alertMessage = "";
            }, 3000);
        },

        formatDate(dateString) {
            if (!dateString) return "N/A"; // Si no hay fecha, devuelve "N/A"
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('es-MX', options); // Usando la configuración en español de México
        },
        async initializeData() {
            try {
                await this.loadInventario(); // Esperar a que termine de cargar el inventario
                await this.loadExistencias(); // Después cargar los artículos
            } catch (error) {
                console.error('Error al inicializar los datos:', error);
                this.isLoading = false;
            }
        },

        // Método loadInventario actualizado (asegúrate de que sea async)
        async loadInventario() {
            try {
                const response = await api.get('/inventario');
                this.inventario = response.data;
                console.log('Inventario cargado:', this.inventario);
            } catch (error) {
                console.error('Error al cargar el inventario:', error);
                this.inventario = []; // Asegurar que inventario sea un array vacío en caso de error
            }
        },

        // Método loadExistencias actualizado
        async loadExistencias() {
            try {
                const response = await api.get('/articulos');
                console.log('Datos cargados:', response.data);
                
                // Verificar que inventario esté cargado
                console.log('Inventario disponible:', this.inventario);
                
                // Obtener los IDs de artículos que ya están en inventario
                const articulosEnInventario = this.inventario.map(item => item.id_articulo);
                console.log('Artículos en inventario (IDs):', articulosEnInventario);
                
                // Filtrar los artículos que NO están en inventario
                const articulosFiltrados = response.data.filter(articulo => {
                    const estaEnInventario = articulosEnInventario.includes(articulo.id);
                    console.log(`Artículo ${articulo.id} - ${articulo.descripcion}: ${estaEnInventario ? 'EN INVENTARIO (filtrado)' : 'DISPONIBLE'}`);
                    return !estaEnInventario;
                });
                
                this.existencias = articulosFiltrados
                    .map(articulo => ({
                        ...articulo,
                        foto_articulo: articulo.foto_articulo ? this.extractFileNames(articulo.foto_articulo) : []
                    }))
                    .sort((a, b) => a.id_objetogasto - b.id_objetogasto);
                    
                console.log('Total artículos filtrados (sin inventario):', this.existencias.length);
                console.log('Artículos mostrados:', this.existencias);
            } catch (error) {
                console.error('Error al cargar los artículos:', error);
            } finally {
                this.isLoading = false;
            }
        },

        // También actualizar el método addToInventario para refrescar la lista
        async addToInventario(existencia) {
            // Guardar el ID del artículo en localStorage para acceso posterior
            localStorage.setItem('articuloId', existencia.id);
            
            // También puedes guardarlo en una variable del componente si lo necesitas
            this.selectedArticuloId = existencia.id;
            
            console.log('ID del artículo seleccionado:', existencia.id);
            
            // Navegar a la página de inventario con los parámetros
            this.$router.push({
                name: 'bieninventario',
                params: { 
                    articuloId: existencia.id
                }
            });
        },

        // Agregar un método para refrescar los datos cuando regreses de otra página
        async refreshData() {
            this.isLoading = true;
            await this.loadInventario();
            await this.loadExistencias();
        },
        // Extraer nombres de archivos de las rutas completas y eliminar la extensión
        extractFileNames(filePaths) {
            return filePaths.split(';').map(path => {
                // Extraer el nombre del archivo de la ruta completa
                const fileName = path.split('\\').pop(); // Extrae "lista.png", "person_128dp_691B31_FILL0_wght400_GRAD0_opsz48.png", etc.
                // Eliminar la extensión del archivo
                return fileName.split('.').slice(0, -1).join('.'); // Elimina la extensión
            });
        },
        // Cargar los objetos de gasto desde la API
        async loadObjetosGasto() {
            try {
                const response = await api.get('/objetoGastos');
                this.objetosGasto = response.data; // Guardar los objetos de gasto en la lista
            } catch (error) {
                console.error('Error al cargar los objetos de gasto:', error);
            }
        },
        async loadFacturas() {
            try {
                const response = await api.get('/facturas');
                this.facturas = response.data; // Guardar las facturas en la lista
            } catch (error) {
                console.error('Error al cargar las facturas:', error);
            }
        },
        // Obtener el número de partida a partir del id_objetogasto
        getNumeroPartida(idObjetogasto) {
            const objetoGasto = this.objetosGasto.find(
                (objeto) => objeto.id === idObjetogasto
            );
            return objetoGasto ? objetoGasto.numero_partida : "N/A";
        },
        getNumeroFactura(idFactura) {  // Cambiado de getNumeroDeFactura a getNumeroFactura
            const factura = this.facturas.find(
                (fact) => fact.id === idFactura
            );
            return factura ? factura.numero_de_factura : "N/A";
        },

        // Cargar los datos del usuario
        async loadUserData() {
            const storedUserName = localStorage.getItem("userName");
            const storedUserEmail = localStorage.getItem("userEmail");

            if (storedUserName && storedUserEmail) {
                this.userName = storedUserName;

                try {
                    // Obtener todos los usuarios de la API
                    const response = await api.get('/personas');
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
        // Obtener la URL completa de la imagen sin extensión
        getImageUrl(fileName) {
            if (!fileName) return ''; // Asegúrate de que fileName no esté vacío
            // Si fileName es un objeto File, generar una URL temporal
            if (fileName instanceof File) {
                return URL.createObjectURL(fileName);
            }
            // Si fileName es una cadena, construir la URL completa con extensión
            return `http://192.168.10.31:3000/api/articulos-files/${fileName}`;
        },
        // Abrir el modal con las imágenes
        openModal(fotos) {
            // Filtrar solo las imágenes que son cadenas (nombres de archivos)
            this.modalImages = fotos.filter(foto => typeof foto === 'string');
            this.showModal = true;
        },
        // Cerrar el modal
        closeModal() {
            this.showModal = false;
            this.modalImages = [];
        },
        // Métodos adicionales (abrir/cerrar modales, paginación, etc.)
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileChange(event) {
            const files = Array.from(event.target.files);
            const validFiles = files.filter(file => this.isImage(file));

            if (validFiles.length + this.currentExistencia.foto_articulo.length > 10) {
                this.errorMessage = "Solo puedes subir hasta 10 imágenes.";
                return;
            }

            // Agregar las imágenes con su nombre completo (incluyendo extensión)
            validFiles.forEach(file => {
                file.preview = URL.createObjectURL(file); // Crear una URL temporal
            });

            this.currentExistencia.foto_articulo.push(...validFiles);
            this.errorMessage = "";
        },

        handleDrop(event) {
            const files = Array.from(event.dataTransfer.files);
            const validFiles = files.filter(file => this.isImage(file));

            if (validFiles.length + this.currentExistencia.foto_articulo.length > 10) {
                this.errorMessage = "Solo puedes subir hasta 10 imágenes.";
                return;
            }

            // Agregar las imágenes con su nombre completo (incluyendo extensión)
            validFiles.forEach(file => {
                file.preview = URL.createObjectURL(file); // Crear una URL temporal
            });

            this.currentExistencia.foto_articulo.push(...validFiles);
            this.errorMessage = "";
        },

        isImage(file) {
            return file.type.startsWith("image/");
        },


        removeImage(index) {
            const img = this.currentExistencia.foto_articulo[index];

            // Si es una imagen existente (no un archivo nuevo), agregarla a la lista de imágenes a eliminar
            if (typeof img === 'string') {
                this.imagesToDelete.push(img); // Agregar a la lista temporal
            }

            // Eliminar la imagen de la lista local
            this.currentExistencia.foto_articulo.splice(index, 1);
        },
        openImageModal() {
            // Filtrar solo las imágenes que son cadenas (nombres de archivos)
            this.modalImages = this.currentExistencia.foto_articulo.filter(foto => typeof foto === 'string');
            this.showImageModal = true;
        },
        closeImageModal() {
            this.showImageModal = false;
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
        editExistencia(existencia) {
            // Guardar una copia de las imágenes originales
            this.originalImages = [...existencia.foto_articulo];
            this.currentExistencia = { ...existencia, foto_articulo: [...existencia.foto_articulo] }; // Copiar las imágenes
            this.isEditing = true;
        },

        cancelEdit() {
            this.isEditing = false;
            this.currentExistencia.foto_articulo = [...this.originalImages]; // Restaurar las imágenes originales
            this.imagesToDelete = []; // Limpiar la lista temporal de imágenes a eliminar
            this.errorMessage = ""; // Limpiar mensajes de error

            // Resetear el input de archivo
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = ""; // Limpiar el valor del input
            }

            // Recargar la lista de artículos (opcional)
            this.loadExistencias();
        },
       
        async saveChanges() {
            try {
                // 1. Eliminar las imágenes marcadas para eliminación
                if (this.imagesToDelete.length > 0) {
                    for (const img of this.imagesToDelete) {
                        await api.delete(`/articulos/${this.currentExistencia.id}/archivo`, {
                            data: { fileName: img.split('/').pop() } // Enviar el nombre del archivo
                        });
                    }
                    this.imagesToDelete = []; // Limpiar la lista temporal
                }

                // 2. Actualizar los datos generales del artículo
                const formData = new FormData();
                formData.append('id_factura', this.currentExistencia.id_factura);
                formData.append('id_objetogasto', this.currentExistencia.id_objetogasto);
                formData.append('descripcion', this.currentExistencia.descripcion);
                formData.append('precio_unitario', this.currentExistencia.precio_unitario);
                formData.append('iva', this.currentExistencia.iva);
                formData.append('importe_con_iva', this.currentExistencia.importe_con_iva);
                formData.append('cantidad', this.currentExistencia.cantidad);
                formData.append('unidad_medida', this.currentExistencia.unidad_medida);
                formData.append('total_ingreso', this.currentExistencia.total_ingreso);

                // Enviar la solicitud PUT para actualizar el artículo
                await api.put(`/articulos/${this.currentExistencia.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // 3. Agregar los archivos nuevos (imágenes)
                const nuevosArchivos = this.currentExistencia.foto_articulo.filter(file => file instanceof File);
                if (nuevosArchivos.length > 0) {
                    const archivosFormData = new FormData();
                    nuevosArchivos.forEach((file) => {
                        archivosFormData.append('foto_articulo', file);
                    });

                    // Enviar la solicitud POST para agregar los archivos
                    await api.post(`/articulos/${this.currentExistencia.id}/archivo`, archivosFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                }

                // Recargar los datos después de guardar los cambios
                await this.loadExistencias();

                // Cerrar el modal de edición y limpiar el formulario
                this.isEditing = false;
                this.currentExistencia = {};
                this.showAlert("Artículo actualizado correctamente", "success");
            } catch (error) {
                console.error('Error al actualizar el artículo:', error);
                this.showAlert("Hubo un error al actualizar el artículo. Inténtalo de nuevo.", "error");
            }
        },

        showDeleteModal(id) {
            this.deleteId = id;
            this.isDeleteModalVisible = true;
        },

        // Método para actualizar tanto la cantidad como el total de la factura
        async updateFacturaData(facturaId, nuevaCantidad, nuevoTotal) {
            try {
                const response = await api.put(`facturas/${facturaId}`, {
                    cantidad: nuevaCantidad,
                    total: nuevoTotal
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (response.status === 200) {
                    console.log('Datos de factura actualizados correctamente');
                    return true;
                }
            } catch (error) {
                console.error('Error al actualizar los datos de factura:', error);
                return false;
            }
        },

        // Método confirmDelete actualizado para incluir la resta del total
        async confirmDelete() {
            try {
                // Encontrar el artículo que se va a eliminar
                const articuloAEliminar = this.existencias.find(
                    existencia => existencia.id === this.deleteId
                );

                if (!articuloAEliminar) {
                    this.showAlert("No se encontró el artículo a eliminar", "error");
                    return;
                }

                // Encontrar la factura correspondiente
                const facturaId = articuloAEliminar.id_factura;
                const factura = this.facturas.find(f => f.id === facturaId);

                if (!factura) {
                    this.showAlert("No se encontró la factura correspondiente", "error");
                    return;
                }

                // Realizar la solicitud DELETE a la API
                await api.delete(`/articulos/${this.deleteId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                // Calcular los nuevos valores para la factura
                const cantidadArticuloEliminado = parseFloat(articuloAEliminar.cantidad) || 0;
                const totalIngresoArticuloEliminado = parseFloat(articuloAEliminar.total_ingreso) || 0;
                
                const cantidadActualFactura = parseFloat(factura.cantidad) || 0;
                const totalActualFactura = parseFloat(factura.total) || 0;
                
                const nuevaCantidadFactura = cantidadActualFactura + cantidadArticuloEliminado;
                const nuevoTotalFactura = totalActualFactura + totalIngresoArticuloEliminado;

                // Actualizar tanto la cantidad como el total en la factura
                const facturaActualizada = await this.updateFacturaData(
                    facturaId, 
                    nuevaCantidadFactura, 
                    nuevoTotalFactura
                );

                if (facturaActualizada) {
                    // Actualizar la factura en el array local
                    const facturaIndex = this.facturas.findIndex(f => f.id === facturaId);
                    if (facturaIndex !== -1) {
                        this.facturas[facturaIndex].cantidad = nuevaCantidadFactura;
                        this.facturas[facturaIndex].total = nuevoTotalFactura;
                        
                        // Si tenía registrada_completa = true, cambiarla a false
                        if (this.facturas[facturaIndex].registrada_completa) {
                            this.facturas[facturaIndex].registrada_completa = false;
                        }
                    }
                }

                // Eliminar el artículo de la lista local
                const index = this.existencias.findIndex(
                    existencia => existencia.id === this.deleteId
                );
                if (index !== -1) {
                    this.existencias.splice(index, 1);
                }

                // Cerrar el modal de confirmación
                this.isDeleteModalVisible = false;
                this.deleteId = null;

                // Mostrar mensaje de éxito
                if (facturaActualizada) {
                    this.showAlert(
                        `Artículo eliminado correctamente. Cantidad disponible: ${nuevaCantidadFactura}, Nuevo total: ${nuevoTotalFactura.toFixed(2)}`, 
                        "success"
                    );
                } else {
                    this.showAlert(
                        "Artículo eliminado, pero hubo un error al actualizar la factura", 
                        "warning"
                    );
                }

            } catch (error) {
                console.error('Error al eliminar el artículo:', error);
                this.showAlert("Hubo un error al eliminar el artículo. Inténtalo de nuevo.", "error");
            }
        },
        cancelDelete() {
            this.isDeleteModalVisible = false;
            this.deleteId = null;
        },
        redirectToAddExistencia() {
            this.$router.push('/newexistencia');
        },
       
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

.existencia-table {
     width: 100%;
    /* Ocupa todo el ancho disponible */
    max-width: 1200px;
    /* Limita el ancho máximo */
    border-collapse: separate;
    border-spacing: 0;
    background-color: white;
    color: #691B31;
    font-size: 14px;
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

</style>