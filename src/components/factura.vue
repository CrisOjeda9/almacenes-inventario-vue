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
                <h1>Facturas</h1>
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
            <div v-if="userRole === 'Inventario' || userRole === 'Administrador'" class="nav-item"
                @mouseenter="showMenu('homeMenu')" @mouseleave="hideMenu('homeMenu')">
                Inventario
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.homeMenu">
                    <button @click="navigateTo('bajas')">Historial de bajas</button>
                    <button @click="navigateTo('historialbienes')">Historial de bienes</button>
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Bienes sin resguardoo</button>
                    <button @click="navigateTo('listaalmacen')">Asignar No.Inventario</button>
                    <button @click="navigateTo('bienesnuevos')">Asignar resguardo</button>
                    <button @click="navigateTo('liberarbien')">Liberar Bien</button>
                    <button @click="navigateTo('reportes')">Generación de reportes</button>
                </div>
            </div>

            <div v-if="userRole === 'Almacenes' || userRole === 'Administrador'" class="nav-item"
                @mouseenter="showMenu('facturaMenu')" @mouseleave="hideMenu('facturaMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.facturaMenu">
                    <button @click="navigateTo('solicitudmaterial')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('existencia')">Entrada de artículos</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')"
                        style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Facturas</button>
                    <button @click="navigateTo('poliza')">Polizas</button>
                </div>
            </div>
        </div>

        <div class="search-bar">
            <div class="input-wrapper">
                <input type="text" v-model="searchQuery" placeholder="Buscar..." />
                <i class="fas fa-search"></i> <!-- Icono de la lupa -->
            </div>

            <!-- Botón para agregar nuevo usuario -->
            <button class="add-factura-btn" @click="redirectToAddfactura">
                <i class="fas fa-file-invoice"></i> <i class="fas fa-plus"></i>
            </button>
        </div>

        <div class="contenedor-tabla">
            <table class="factura-table">
                <thead>
                    <tr>
                        <th>Tipo de alta</th>
                        <th>Tipo de documento que ampara</th>
                        <th>Fecha de adquisición</th>
                        <th>No. Factura</th>
                        <th>Tipo de compra</th>
                        <th>Concepto</th>
                        <th>Fecha de Factura</th>
                        <th>Nombre Proveedor</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Precio total sin IVA</th>
                        <th>IVA</th>
                        <th>Precio total con IVA</th>
                        <th>Documento</th>
                        <th>Fecha de registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="factura in paginatedfactura" :key="factura.id">
                        <td>{{ factura.tipo_alta }}</td>
                        <td>{{ factura.tipo_documento_ampara }}</td>
                        <td>{{ formatDate(factura.fecha_adquisicion) }}</td>
                        <td>{{ factura.numero_de_factura }}</td>
                        <td>{{ factura.tipo_compra }}</td>
                        <td>{{ factura.concepto }}</td>
                        <td>{{ formatDate(factura.fecha_factura) }}</td>
                        <td>{{ getNombreProveedor(factura.id_proveedor) }}</td>
                        <!-- Aquí se muestra el nombre del proveedor -->
                        <td>{{ factura.cantidad }}</td>
                        <td>{{ factura.precio_unitario }}</td>
                        <td>{{ factura.sub_total }}</td>
                        <td>{{ factura.iva }}</td>
                        <td>{{ factura.total }}</td>
                        <td>
                            <template v-if="factura.archivo_pdf">
                                <ul>
                                    <li v-for="(file, index) in getPdfFiles(factura.archivo_pdf)" :key="index">
                                        <!-- Aplicar truncateFileName al nombre del archivo -->
                                        <a :href="file.url" target="_blank" :title="file.name">
                                            {{ truncateFileName(file.name, 20) }}
                                        </a>
                                    </li>
                                </ul>
                            </template>
                            <button @click="downloadZip(factura)" class="btn-download">
                                <p class="textoDescarga">Descargar</p>
                            </button>
                        </td>
                        <td>{{ formatDate(factura.createdAt) }}</td>
                        <td>
                            <button @click="editfactura(factura)" class="btn-edit">Editar</button>
                            <button @click="showDeleteModal(factura.id)" class="btn-delete">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Modal de Edición -->
            <div v-if="isEditing" class="edit-modal">
                <div class="modal-content">
                    <h3>Editar Factura</h3>
                    <form @submit.prevent="saveChanges" class="edit-form">
                        <div class="contenedorformulario">
                            <!-- Primera columna del formulario -->
                            <div class="form-column">
                                <div>
                                    <label>Tipo de alta:</label>
                                    <select v-model="currentFactura.tipo_alta" class="form-input">
                                        <option value="" disabled selected>Selecciona un tipo de alta</option>
                                        <option v-for="tipo in tiposAlta" :key="tipo.value" :value="tipo.value">
                                            {{ tipo.label }}
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label>Tipo de documento que ampara:</label>
                                    <select v-model="currentFactura.tipo_documento_ampara" class="form-input">
                                        <option value="" disabled selected>Selecciona un tipo de documento</option>
                                        <option v-for="tipo in tipoAmpara" :key="tipo.value" :value="tipo.value">
                                            {{ tipo.label }}
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label>Factura No.:</label>
                                    <input v-model="currentFactura.numero_de_factura" type="text" />
                                </div>
                                <div>
                                    <label>Tipo de compra:</label>
                                    <select v-model="currentFactura.tipo_compra" class="form-input">
                                        <option value="" disabled selected>Selecciona un tipo de compra</option>
                                        <option v-for="tipo in tiposCompra" :key="tipo.value" :value="tipo.value">
                                            {{ tipo.label }}
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label>Concepto:</label>
                                    <input v-model="currentFactura.concepto" type="text" />
                                </div>
                                <div style="width: 100%;">
                                    <label>Proveedor: (Selecciona uno)</label>
                                    <select v-model="currentFactura.id_proveedor" style="height: 40px; width: 320px;"
                                        class="form-input">
                                        <option value="" disabled>Selecciona una opción</option>
                                        <option v-for="proveedor in proveedores" :key="proveedor.id"
                                            :value="proveedor.id">
                                            {{ proveedor.nombre }} {{ proveedor.apellidos }}
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label>Cantidad:</label>
                                    <input v-model="currentFactura.cantidad" type="text" />
                                </div>
                            </div>

                            <!-- Segunda columna del formulario -->
                            <div class="form-column">


                                <div>
                                    <label>Precio unitario:</label>
                                    <input v-model="currentFactura.precio_unitario" type="text" />
                                </div>
                                <div>
                                    <label>Total sin IVA:</label>
                                    <input v-model="currentFactura.sub_total" type="text" />
                                </div>
                                <div>
                                    <label>IVA:</label>
                                    <input v-model="currentFactura.iva" type="text" />
                                </div>
                                <div>
                                    <label>Total con IVA:</label>
                                    <input v-model="currentFactura.total" type="text" />
                                </div>
                                <div class="contenedor-dropzone">
                                    <label for="archivo_pdf">Documento (PDF, JPG, PNG)</label>
                                    <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent
                                        @click="triggerFileInput">
                                        <!-- Campo de subida de archivo -->
                                        <input type="file" id="archivo_pdf" ref="fileInput" @change="handleFileChange"
                                            accept=".pdf,.jpg,.png" style="display: none;" multiple />

                                        <!-- Ícono y mensaje -->
                                        <i class="fas fa-cloud-upload-alt"></i>
                                        <span v-if="!currentFactura.archivo_pdf">
                                            Arrastra aquí o haz clic para subir un archivo
                                        </span>
                                        <span v-else>
                                            Archivo: {{ currentFactura.archivo_pdf }}
                                        </span>
                                    </div>
                                    <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
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


            <!-- Modal de Confirmación de Eliminación -->
            <div v-if="isDeleteModalVisible" class="modal-overlay">
                <div class="modal-content-delete">
                    <h3>¿Estás seguro de eliminar esta factura?</h3>
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
    </div>
</template>

<script>
export default {
    name: "facturaPage",
    data() {
        return {
            userRole: localStorage.getItem('userRole') || '',
            userName: "Cargando...",
            profileImage: "",
            isDeleteModalVisible: false,
            menus: {
                homeMenu: false,
                facturaMenu: false,
                settingsMenu: false,
            },
            searchQuery: '',
            currentPage: 1,
            facturaPerPage: 10,
            isEditing: false,
            currentFactura: {
                proveedor: "",
            },
            tiposAlta: [ // Opciones para el campo "Tipo de alta"
                { value: 'Compra (CM)', label: 'Compra (CM)' },
                { value: 'Donacion (DN)', label: 'Donacion (DN)' },
                { value: 'Comodato (CO)', label: 'Comodato (CO)' }
            ],
            tiposCompra: [ // Opciones para el campo "Tipo de compra"
                { value: 'Presupuesto', label: 'Presupuesto' },
                { value: 'Estatal', label: 'Estatal' }
            ],
            tipoAmpara: [ // Opciones para el campo "Tipo de documento que ampara"
                { value: 'Contrato De Comodato (CO)', label: 'Contrato De Comodato (CO)' },
                { value: 'Comprobante Fiscal Digital por Internet (CFDI)', label: 'Comprobante Fiscal Digital por Internet (CFDI)' }
            ],
            proveedores: [], // Ensure this is initialized as an empty array
            facturas: [], // Ensure this is initialized as an empty array

            selectedFile: null, // Variable para almacenar el archivo temporalmente
        };
    },
    computed: {
        filteredfactura() {
            const query = this.searchQuery.toLowerCase();
            return this.facturas.filter(factura => {
                const nombreProveedor = this.getNombreProveedor(factura.id_proveedor)?.toLowerCase() || '';
                return (
                    (factura.tipo_alta?.toString() || '').toLowerCase().includes(query) ||
                    (factura.tipo_documento_ampara || '').toLowerCase().includes(query) ||
                    (factura.numero_de_factura || '').toLowerCase().includes(query) ||
                    (factura.tipo_compra || '').toLowerCase().includes(query) ||
                    (factura.concepto || '').toLowerCase().includes(query) ||
                    (factura.fechafactura || '').toLowerCase().includes(query) ||
                    nombreProveedor.includes(query) || // Buscar por nombre del proveedor
                    (factura.cantidad?.toString() || '').toLowerCase().includes(query) ||
                    (factura.precio_unitario?.toString() || '').toLowerCase().includes(query) ||
                    (factura.sub_total?.toString() || '').toLowerCase().includes(query) ||
                    (factura.iva?.toString() || '').toLowerCase().includes(query) ||
                    (factura.totalconiva?.toString() || '').toLowerCase().includes(query)
                );
            });
        },


        totalPages() {
            return Math.ceil(this.filteredfactura.length / this.facturaPerPage);
        },
        paginatedfactura() {
            const start = (this.currentPage - 1) * this.facturaPerPage;
            const end = start + this.facturaPerPage;
            return this.filteredfactura.slice(start, end);
        }
    },
    mounted() {
        this.loadUserData();
        this.fetchProveedores();
        this.fetchFacturas();
    },
    methods: {
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('es-MX', options); // Usando la configuración en español de México
        },
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
        async fetchProveedores() {
            try {
                const response = await fetch("http://localhost:3000/api/proveedor");
                if (!response.ok) {
                    throw new Error("Error al obtener proveedores");
                }
                this.proveedores = await response.json();
            } catch (error) {
                console.error("Error al cargar los proveedores:", error);
            }
        },
        async fetchFacturas() {
            try {
                const response = await fetch("http://localhost:3000/api/facturas");
                if (!response.ok) {
                    throw new Error("Error al obtener facturas");
                }
                this.facturas = await response.json();
            } catch (error) {
                console.error("Error al cargar las facturas:", error);
            }
        },
        getNombreProveedor(idProveedor) {
            const proveedor = this.proveedores.find(prov => prov.id === idProveedor);
            return proveedor ? `${proveedor.nombre} ${proveedor.apellidos}` : "Proveedor desconocido";
        },
        triggerFileInput() {
            this.$refs.fileInput.click(); // Abre el explorador de archivos al hacer clic
        },
        truncateFileName(name, maxLength) {
            return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
        },

        // Método para obtener solo el nombre del archivo sin la extensión
        getPdfName(pdfPath) {
            const fileName = pdfPath.split('/').pop().split('\\').pop();  // Extrae solo el nombre del archivo
            return fileName.split('.')[0]; // Devuelve solo el nombre sin la extensión .pdf
        },

        getPdfFiles(pdfPaths) {
            if (!pdfPaths) return []; // Si no hay archivos, retorna un array vacío

            return pdfPaths.split(';').map((path) => {
                const fileName = path.split('/').pop().split('\\').pop(); // Extrae el nombre del archivo
                const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.'); // Quita la extensión

                return {
                    url: `http://localhost:3000/api/facturas-files/${nameWithoutExtension}`, // URL sin extensión para visualización
                    downloadUrl: `http://localhost:3000/api/facturas-files/${nameWithoutExtension}`, // URL sin extensión para descarga
                    name: nameWithoutExtension // Nombre sin extensión
                };
            });
        },

        async downloadZip(factura) {
            try {
                // Obtener los archivos PDF
                const pdfFiles = this.getPdfFiles(factura.archivo_pdf);

                // Verificar si hay archivos para descargar
                if (pdfFiles.length === 0) {
                    alert("No hay archivos para descargar.");
                    return;
                }

                // Descargar cada archivo PDF individualmente
                for (const file of pdfFiles) {
                    // Hacer una solicitud a la API para obtener el archivo
                    const response = await fetch(file.downloadUrl); // Usar la URL de descarga sin extensión

                    // Verificar si la respuesta es exitosa
                    if (!response.ok) {
                        throw new Error(`Error al obtener el archivo: ${response.statusText}`);
                    }

                    // Convertir la respuesta a un Blob
                    const blob = await response.blob();

                    // Crear un enlace para descargar el archivo
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob); // Crear una URL temporal para el Blob
                    link.download = file.name + '.pdf'; // Nombre del archivo con extensión
                    document.body.appendChild(link);
                    link.click(); // Simular clic para iniciar la descarga
                    document.body.removeChild(link); // Eliminar el enlace del DOM
                    URL.revokeObjectURL(link.href); // Liberar la URL temporal
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error al descargar los archivos PDF. Por favor, inténtalo de nuevo.');
            }
        },


        handleDrop(event) {
            const files = event.dataTransfer.files;
            if (files.length > 1) {
                this.errorMessage = "Solo se permite subir un archivo.";
                return;
            }
            this.errorMessage = ''; // Limpiar el mensaje de error si no hay error
            const file = files[0];
            if (file) {
                this.currentFactura.archivo_pdf = file.name; // Guarda solo el nombre del archivo
            }
        },
        goHome() {
            this.$router.push('home'); // Redirige a la página principal ("/"). Cambia el path si es necesario.
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
        // Método para manejar el cambio de archivo
        // Método para manejar el cambio de archivo (solo almacena el archivo)
        handleFileChange(event) {
            const files = event.target.files;
            if (files.length === 0) return; // Si no hay archivos, no hacer nada

            this.selectedFile = files[0]; // Guardamos el archivo temporalmente
        },

        // Método para editar una factura
        editfactura(factura) {
            this.currentFactura = { ...factura }; // Copiar datos de la factura
            this.currentFactura.id_proveedor = factura.id_proveedor; // Asegurar que el id_proveedor se copie
            this.isEditing = true; // Abrir el modal de edición
            this.selectedFile = null; // Resetear archivo seleccionado
        },

        // Método para guardar cambios (incluyendo la subida del archivo si existe)
        async saveChanges() {
    try {
        // 1. Actualizar los datos de la factura
        const response = await fetch(`http://localhost:3000/api/facturas/${this.currentFactura.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...this.currentFactura,
                id_proveedor: this.currentFactura.id_proveedor // Asegurar que el id_proveedor se envíe
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar la factura');
        }

        // 2. Subir el archivo si se seleccionó uno
        if (this.selectedFile) {
            const formData = new FormData();
            formData.append('archivo_pdf', this.selectedFile);

            const fileResponse = await fetch(`http://localhost:3000/api/facturas/${this.currentFactura.id}/reemplazar-archivo`, {
                method: 'PUT',
                body: formData,
            });

            if (!fileResponse.ok) {
                throw new Error('Error al subir el archivo');
            }
        }

        // Mensaje de éxito
        alert('Factura actualizada correctamente.');

        // Recargar la lista de facturas y cerrar el modal
        await this.fetchFacturas();
        await this.fetchProveedores();
        this.isEditing = false;
        this.currentFactura = {};
        this.selectedFile = null; // Limpiar el archivo seleccionado después de guardar
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Hubo un error al actualizar la factura. Por favor, inténtalo de nuevo.');
    }
},
        cancelEdit() {
            this.isEditing = false;
            this.currentFactura = {}; // Limpiar el objeto
        },

        showDeleteModal(id) {
            this.deleteId = id;
            this.isDeleteModalVisible = true;
        },
        async confirmDelete() {
            try {
                const response = await fetch(`http://localhost:3000/api/facturas/${this.deleteId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar la factura');
                }

                // Si la eliminación fue exitosa, actualiza la lista de facturas
                this.fetchFacturas();
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un error al eliminar la factura. Por favor, inténtalo de nuevo.');
            } finally {
                this.isDeleteModalVisible = false;
                this.deleteId = null;
            }
        },
        cancelDelete() {
            this.isDeleteModalVisible = false;
            this.deleteId = null;
        },
        redirectToAddfactura() {
            // Aquí defines la ruta a la que quieres redirigir al hacer clic en el botón
            this.$router.push('/newfactura');
        },



    }
};
</script>

<style scoped>
/* Aplicar Montserrat a todo el contenido */
* {
    font-family: 'Montserrat', sans-serif;
}

td ul {
    list-style-type: none;
    /* Quita los puntos de la lista */
    padding: 0;
    margin: 0;
}

td ul li {
    margin-bottom: 5px;
    /* Espacio entre elementos */
}

td ul li a {
    text-decoration: none;
    color: #007bff;
    font-weight: bold;
}

td ul li a:hover {
    text-decoration: underline;
}

.btn-download {
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    width: 100%;
    height: 20px;
}

.btn-download:hover {
    background: #bc955b;
}

.textoDescarga {
    font-size: 14px;

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

/* Contenedor responsivo */
.contenedor-tabla {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    /* Habilita desplazamiento horizontal */
}

/* Tabla principal */
.factura-table {
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

.factura-table th,
.factura-table td {
    padding: 10px;
    text-align: center;
    word-wrap: break-word;
    /* Permite el ajuste de palabras largas */
}

.factura-table th {
    background-color: #BC955B;
    color: white;
}

.factura-table tr:hover {
    background-color: #70727265;
    color: #A02142;
    transition: background-color 0.3s ease;
}

/* Botones */
.btn-edit,
.btn-delete {
    text-align: center;
    padding: 5px 15px;
    border: none;
    cursor: pointer;
    width: 100%;
    /* Botones se ajustan al ancho */
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

/* Media queries para pantallas más pequeñas */
@media (max-width: 1400px) {
    .factura-table {
        font-size: 14px;
    }

    .factura-table th,
    .factura-table td {
        padding: 8px;
    }

    .btn-edit,
    .btn-delete {
        padding: 5px;
    }
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



.add-factura-btn {
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

.add-factura-btn:hover {
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
    font-size: 20px;
    background: #691B31;
    padding: 10px;
    border-radius: 25px;
    width: 80%;
    height: 600px;
    max-width: 800px;
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

.form-column select {
    background-color: #dcdcdc;
    color: #691B31;
    width: 315px;
    height: 36px;
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


.form-input {
    width: 85%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 25px;
    box-sizing: border-box;
    background-color: #dcdcdc;
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

/* Contenedor padre para centrar el Dropzone */
.contenedor-dropzone {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    /* Ajusta según tus necesidades */
}

.contenedor-dropzone label {
    color: white;
}
</style>