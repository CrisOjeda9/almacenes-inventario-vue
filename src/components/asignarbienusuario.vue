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
                <h1>Asignar Bien a un Usuario</h1>
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
                    <button @click="navigateTo('resguardo')">Bienes sin resguardo</button>
                    <button @click="navigateTo('listaalmacen')">Asignar No.Inventario</button>
                    <button @click="navigateTo('bienesnuevos')"
                        style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Asignar
                        resguardo</button>
                    <button @click="navigateTo('liberarbien')">Liberar Bien</button>
                    <button @click="navigateTo('reportes')">Generación de reportes</button>

                </div>
            </div>

            <div v-if="userRole === 'Almacen' || userRole === 'Administrador'" class="nav-item"
                @mouseenter="showMenu('bajabienMenu')" @mouseleave="hideMenu('bajabienMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.bajabienMenu">
                    <button @click="navigateTo('solicitudmaterial')">Salida de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('existencia')">Entrada de artículos</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('poliza')">Polizas</button>
                </div>
            </div>
        </div>
        <!-- Barra de búsqueda -->
        <div class="search-bar">
            <div class="input-wrapper">
                <input type="text" v-model="searchQuery" placeholder="Número de inventario" />
                <i class="fas fa-search"></i>
            </div>
            <div class="button-wrapper">
                <button @click="startSearch" class="search-button">Buscar</button>
                <button v-if="showClearButton" @click="clearSearch" class="clear-button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>

        <!-- Modal para mostrar alerta -->
        <div v-if="showErrorModal" class="modal-overlay">
            <div class="modal">
                <p>Número de inventario no encontrado.</p>
                <button @click="closeModal">Cerrar</button>
            </div>
        </div>


        <!-- Formulario -->
        <div class="form-container">
            <form @submit.prevent="registerBajaBien">
                <div class="form-row">
                    <!-- Descripción -->
                    <div class="form-field">
                        <label for="descripcion">Descripción</label>
                        <input type="text" id="descripcion" :value="form.descripcion" readonly
                            style="background-color: #dcddcd;" />
                    </div>
                    <!-- Modelo -->
                    <div class="form-field">
                        <label for="modelo">Modelo</label>
                        <input type="text" id="modelo" :value="form.modelo" readonly
                            style="background-color: #dcddcd;" />
                    </div>
                    <!-- Marca -->
                    <div class="form-field">
                        <label for="marca">Marca</label>
                        <input type="text" id="marca" :value="form.marca" readonly style="background-color: #dcddcd;" />
                    </div>
                    <!-- Serie -->
                    <div class="form-field">
                        <label for="serie">Serie</label>
                        <input type="text" id="serie" :value="form.serie" readonly style="background-color: #dcddcd;" />
                    </div>
                </div>
                <hr style="margin-bottom: 20px;">
                <div class="form-row">
                    <!-- Foto del bien -->
                    <div class="form-field">
                        <label for="fotoBien">Foto del bien</label>
                        <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent @click="triggerFileInput"
                            style="background-color: #dcddcd;">
                            <input type="file" id="fotoBien" ref="fileInput" @change="handleFileUpload" readonly
                                accept=".jpg,.png" />
                            <i class="fas fa-cloud-upload-alt" style="color: #691b31;"></i>
                            <span v-if="!form.fotoBien" style="color: #691b31; margin-left: 2px;">Arrastra/Selecciona
                                una foto</span>
                            <span v-else>{{ form.fotoBien.name }}</span>
                        </div>
                    </div>

                    <!-- Unidad Presupuestal -->
                    <div class="form-field">
                        <label for="unidadPresupuestal">Área Presupuestal</label>
                        <input type="text" id="unidadPresupuestal" value="Radio y Televisión de Hidalgo" readonly
                            style="background-color: #dcddcd;" />
                    </div>

                    <div class="form-field">
                        <label for="responsable">Nombre del responsable</label>
                        <input type="text" id="responsable" placeholder="" v-model="form.responsable"
                            @input="filterResponsables" required autocomplete="off" />
                        <ul v-if="filteredResponsables.length > 0" class="autocomplete-list">
                            <li v-for="responsable in filteredResponsables" :key="responsable.nombre"
                                @click="selectResponsable(responsable)">
                                {{ responsable.nombre }}
                            </li>
                        </ul>
                    </div>

                    <!-- Departamento del responsable -->
                    <div class="form-field">
                        <label for="departamento">Departamento del responsable</label>
                        <input type="text" id="departamento" v-model="form.departamento" readonly
                            style="background-color: #dcddcd;" />
                    </div>

                    <!-- Área del responsable -->
                    <div class="form-field">
                        <label for="area">Área del responsable</label>
                        <input type="text" id="area" v-model="form.area" readonly style="background-color: #dcddcd;" />
                    </div>

                    <!-- RFC del responsable -->
                    <div class="form-field">
                        <label for="rfc">RFC del responsable</label>
                        <input type="text" id="rfc" v-model="form.rfc" readonly style="background-color: #dcddcd;" />
                    </div>


                    <!-- Fecha de resguardo -->
                    <div class="form-field" style="margin-bottom: 30px;">
                        <label for="resguardofecha">Fecha de Resguardo</label>
                        <input type="date" id="resguardofecha" v-model="form.resguardofecha" :min="today" required />
                    </div>

                    <div class="form-field">
                        <label for="fotoBienBaja">Foto del bien recibido</label>
                        <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent @click="triggerFileInput">
                            <input type="file" id="fotoBienBaja" ref="fileInputBaja" multiple @change="handleFileUpload"
                                accept="image/*" />
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span v-if="form.fotoBienRecibido.length === 0">Arrastra o selecciona imágenes (JPG,
                                PNG)</span>
                            <span v-else>{{ form.fotoBienRecibido.length }} imágenes seleccionadas</span>
                        </div>
                        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

                        <!-- Botón para abrir el modal con los nombres de las imágenes -->
                        <button v-if="form.fotoBienRecibido.length > 0" @click.prevent="openImageModal"
                            class="view-images-btn">
                            Ver Imágenes
                        </button>
                    </div>

                </div>

                <div class="button-container">
                    <button class="boton" type="submit">
                        <i class="fas fa-plus"></i> Asignar bien
                    </button>
                </div>
            </form>

        </div>
        <!-- Modal para mostrar las imágenes y sus nombres -->
        <div v-if="showImageModal" class="modal-overlay">
            <div class="modal">
                <h2>Imágenes seleccionadas</h2>
                <div class="image-preview-container">
                    <!-- Vista previa de las imágenes con su nombre -->
                    <div v-for="(img, index) in form.fotoBienRecibido" :key="index" class="image-preview">
                        <div class="image-container">
                            <img :src="getImageUrl(img)" :alt="img.name" class="image-preview-img" />
                            <button @click="removeImage(index)" class="remove-btn">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                        <p class="image-name">{{ img.name }}</p>
                    </div>
                </div>
                <button @click="closeImageModal">Cerrar</button>
            </div>
        </div>


    </div>
</template>

<script>
export default {
    name: "asignarBienPage",
    data() {
        return {
            userRole: localStorage.getItem('userRole') || '', // Obtener el rol desde el localStorage
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario
            showClearButton: false,
            showErrorModal: false,  // Controla la visibilidad del modal de error
            searchQuery: '',  // Número de inventario ingresado por el usuario

            form: {
                descripcion: "",
                marca: "",
                modelo: "",
                serie: "",
                responsable: "",
                departamento: "",
                area: "",
                rfc: "",
                resguardofecha: "",
                unidadPresupuestal: "Radio y Televisión de Hidalgo",
                fotoBien: null,
                fotoBienRecibido: [] // Ahora se asegura de que sea un array vacío
            },
            responsables: [
                { nombre: "Juan Pérez", departamento: "Administración", area: "Finanzas", rfc: "JUAP921214ABC" },
                { nombre: "María López", departamento: "Recursos Humanos", area: "Operaciones", rfc: "MALO850701XYZ" },
                { nombre: "Carlos Sánchez", departamento: "Tecnología", area: "Soporte Técnico", rfc: "CASO760612DEF" },
                // Otros responsables...
            ],
            filteredResponsables: [], // Para almacenar los responsables filtrados
            today: new Date().toISOString().split("T")[0], // Obtiene la fecha actual en formato YYYY-MM-DD

            menus: {
                homeMenu: false,
            },
            inventoryData: [ // Datos simulados (puedes usar una API en lugar de esto)
                {
                    numeroInventario: "12345",
                    descripcion: "Laptop HP ProBook",
                    modelo: "ProBook 450 G8",
                    marca: "HP",
                    serie: "5CD12345XYZ"
                },
                {
                    numeroInventario: "67890",
                    descripcion: "Impresora Canon",
                    modelo: "PIXMA G6020",
                    marca: "Canon",
                    serie: "ABC67890DEF"
                }
            ],
            fotoBienRecibido: [],// Ahora es un array para múltiples imágenes
            showImageModal: false,  // Controla la visibilidad del modal


        };

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


        openImageModal() {
            this.showImageModal = true;
        },
        // Método para cerrar el modal
        closeImageModal() {
            this.showImageModal = false;
        },

        filterResponsables() {
            // Verifica si el campo de responsable tiene texto
            if (this.form.responsable.trim() !== "") {
                const searchTerm = this.form.responsable.toLowerCase();
                this.filteredResponsables = this.responsables
                    .filter(responsable =>
                        responsable.nombre.toLowerCase().includes(searchTerm)
                    )
                    .sort((a, b) => a.nombre.localeCompare(b.nombre));  // Orden alfabético
            } else {
                // Si no hay texto en el campo, limpia los resultados filtrados
                this.filteredResponsables = [];
            }
        },



        // Cuando seleccionas un responsable de la lista, actualiza los campos
        selectResponsable(responsable) {
            this.form.responsable = responsable.nombre;  // Asigna el nombre al campo
            this.form.departamento = responsable.departamento;
            this.form.area = responsable.area;
            this.form.rfc = responsable.rfc;

            // Limpia la lista de resultados filtrados
            this.filteredResponsables = [];
        },
        startSearch() {
            const foundItem = this.inventoryData.find(
                (item) => item.numeroInventario === this.searchQuery
            );

            if (foundItem) {
                // Actualiza los valores del formulario con los datos encontrados
                this.form.descripcion = foundItem.descripcion;
                this.form.modelo = foundItem.modelo;
                this.form.marca = foundItem.marca;
                this.form.serie = foundItem.serie;
                this.showClearButton = true;  // Muestra el botón de limpiar
                this.showErrorModal = false; // Asegura que el modal esté cerrado
            } else {
                // Mostrar el modal de error
                this.showErrorModal = true;
                this.showClearButton = false;  // Oculta el botón de limpiar
            }
        },
        closeModal() {
            // Cierra el modal
            this.showErrorModal = false;
        },
        clearSearch() {
            this.searchQuery = '';
            this.form.descripcion = '';
            this.form.modelo = '';
            this.form.marca = '';
            this.form.serie = '';
            this.showClearButton = false;
            this.showErrorModal = false;  // Asegura que el modal esté cerrado al limpiar
        },
        goHome() {
            this.$router.push("/home");
        },

        registerBajaBien() {
            // Verifica si el nombre del responsable está vacío
            if (!this.form.responsable.trim()) {
                // Muestra un mensaje de error si el campo está vacío
                alert("Por favor, ingresa el nombre del responsable.");
                return;  // Detiene la ejecución si el campo está vacío
            }

            // Aquí puedes agregar la lógica para enviar los datos del formulario
            console.log("Formulario enviado:", this.form);

            // Redirige a la página historialbienes
            this.$router.push({ name: 'historialbienes' }).catch(err => {
                console.error("Error al redirigir: ", err);
            });
        }
        ,

        showMenu(menu) {
            this.menus[menu] = true;
        },
        hideMenu(menu) {
            this.menus[menu] = false;
        },
        navigateTo(page) {
            this.$router.push({ name: page });
        },
        triggerFileInput() {
            this.$refs.fileInputBaja.click();
        },
        handleFileUpload(event) {
            if (!event || !event.target || !event.target.files) return;

            if (!this.form.fotoBienRecibido) {
                this.form.fotoBienRecibido = [];
            }

            const files = Array.from(event.target.files);
            const validFiles = files.filter(file => this.isImage(file));

            if (validFiles.length + this.form.fotoBienRecibido.length > 10) {
                this.errorMessage = "Solo puedes subir hasta 10 imágenes.";
                return;
            }

            this.form.fotoBienRecibido.push(...validFiles);
            this.errorMessage = "";
        },
        isImage(file) {
            return file.type.startsWith("image/");
        },
        getImageUrl(file) {
            return URL.createObjectURL(file);
        },
        removeImage(index) {
            this.form.fotoBienRecibido.splice(index, 1);
        }

    },
};
</script>



<style scoped>
/* Aplicar Montserrat a todo el contenido */
* {
    font-family: 'Montserrat', sans-serif;
}

.image-preview-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.image-preview {
    text-align: center;
    position: relative;
    /* Esto es necesario para posicionar el botón dentro de la imagen */
}

.image-container {
    position: relative;
}

.image-preview-img {
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

.image-name {
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
    width: 100%;
    background-color: #691b31;
    color: white;
    border: none;
    padding: 5px;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 2px;
    font-size: 15px;
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
    z-index: 1;
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

/* Formulario */
.form-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;


}

form {
    background: white;
    padding: 30px;
    padding-bottom: 80px;
    border-radius: 10px;
    width: 1000px;
    height: 290px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.form-row {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    padding-bottom: 15px;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
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
}



label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    color: #691B31;

}

a {
    text-decoration: none;

}

/* Estilo para la fila de campos */
.form-row {
    display: flex;
    gap: 20px;
    /* Espacio entre los campos en la misma fila */
    flex-wrap: wrap;
    /* Permite que los campos se ajusten a nuevas filas si no caben */
}

/* Estilo para cada campo en la fila */
.form-field {
    flex: 1;
    /* Cada campo ocupa un 100% del ancho disponible dentro de la fila */
    min-width: 200px;
    /* Establece un ancho mínimo para que no se colapse */

}

/* Estilo de los inputs dentro de la fila */
.form-field input,
.form-field select,
.form-field textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
}




/* Estilos del Dropzone */
.dropzone {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed #98989A;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s ease;
    width: 100%;
    /* Ocupa todo el ancho disponible */
    height: auto;
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



.dropzone span {
    font-size: 13px;
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


/* Barra de búsqueda */
.search-bar {
    margin: 20px 0;
    text-align: center;
    display: flex;
    justify-content: center;
    gap: 30px;
    align-items: center;
}

/* Contenedor de los botones */
.input-wrapper {
    position: relative;
    width: 40%;
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

/* Botón de búsqueda */
.search-button {
    margin-right: 45px;
    width: 150px;
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: #BC955B;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.search-button:hover {
    background-color: #691B31;
}

/* Contenedor de los botones para asegurarnos de que no se mueva nada */
.button-wrapper {
    display: flex;
    gap: 10px;
    position: relative;
}

/* Botón de Clear */
.clear-button {
    font-size: 10px;
    color: #fff;
    background-color: #BC955B;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    position: absolute;
    right: 0;
    /* Siempre alineado a la derecha del contenedor */
    top: 50%;
    transform: translateY(-50%);
    display: none;
    /* Inicialmente oculto */
    width: auto;
    height: auto;
}

.clear-button:hover {
    background-color: #691B31;
}

/* Mostrar el botón de Clear cuando sea necesario */
.search-bar .clear-button {
    display: block;
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

.autocomplete-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    border-top: none;
    max-height: 150px;
    overflow-y: auto;
    position: absolute;
    width: 300px;
    background-color: #A02142;
    z-index: 1000;
    color: white;
}

.autocomplete-list li {
    padding: 8px;
    cursor: pointer;
}

.autocomplete-list li:hover {
    background-color: #dcdcdc;
    color: #691B31;
}
</style>