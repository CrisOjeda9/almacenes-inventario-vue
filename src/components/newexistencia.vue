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
                <h1>Entrada de Artículos</h1>
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
            <a href="users" class="nav-item">Usuarios</a>
            <div class="nav-item" @mouseenter="showMenu('homeMenu')" @mouseleave="hideMenu('homeMenu')">
                Inventario
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.homeMenu">
                    <button @click="navigateTo('bajas')">Historial de bajas</button>
                    <button @click="navigateTo('historialbienes')">Historial de bienes</button>
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Bienes sin resguardo</button>
                    <button @click="navigateTo('listaalmacen')">Asignar No.Inventario</button>
                    <button @click="navigateTo('reportes')">Generación de reportes</button>
                    <button @click="navigateTo('bienesnuevos')">Asignar resguardo</button>


                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('existenciaMenu')" @mouseleave="hideMenu('existenciaMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.existenciaMenu">
                    <button @click="navigateTo('solicitudmaterial')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('existencia')"
                        style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Entrada de
                        existencias</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('poliza')">Polizas</button>
                </div>
            </div>
        </div>

        <!-- Formulario -->
        <div class="form-container">
            <form @submit.prevent="registerExistencia">
                <div class="form-row">
                    <!-- ID -->
                    <div class="form-field">
                        <label for="id">ID</label>
                        <input type="number" min="0" id="id" placeholder="" v-model="form.id" required />
                    </div>

                    <!-- Número de factura -->
                    <div class="form-field">
                        <label for="numerofactura">Número de factura</label>
                        <input type="number" min="0" id="numerofactura" placeholder=""
                            v-model="form.numeroFactura" required />
                    </div>



                    <!-- Número de partida -->
                    <div class="form-field">
                        <label for="numeroPartida">Número de partida</label>
                        <select id="numeroPartida" v-model="form.numeroPartida" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="fisico">Físico</option>
                            <option value="moral">Moral</option>
                        </select>
                    </div>
                    <!-- Nombre -->
                    <div class="form-field">
                        <label for="nombre">Nombre</label>
                        <input type="text" id="nombre" placeholder="" v-model="form.nombre"
                            required />
                    </div>
                </div>

                <div class="form-row">


                    <!-- Importe sin IVA -->
                    <div class="form-field">
                        <label for="importeSinIVA">Importe sin IVA</label>
                        <input type="number" step="0.01" min="0" id="importeSinIVA" placeholder=""
                            v-model="form.importeSinIVA" required />
                    </div>

                    <!-- IVA -->
                    <div class="form-field">
                        <label for="iva">IVA</label>
                        <input type="number" step="0.01" min="0" id="iva" placeholder="" v-model="form.iva"
                            required />
                    </div>

                    <!-- Importe con IVA -->
                    <div class="form-field">
                        <label for="importeConIVA">Importe con IVA</label>
                        <input type="number" step="0.01" id="importeConIVA" min="0" placeholder=""
                            v-model="form.importeConIVA" required />
                    </div>
                    <!-- Cantidad -->
                    <div class="form-field">
                        <label for="cantidad">Cantidad</label>
                        <input type="number" min="0" id="cantidad" placeholder="" v-model="form.cantidad"
                            required />
                    </div>
                </div>

                <div class="form-row">

                    <!-- Unidad de medida -->
                    <div class="form-field">
                        <label for="unidadmedida">Unidad de medida</label>
                        <select id="unidadmedida" v-model="form.unidadmedida" required>
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




                    <!-- Total de ingreso -->
                    <div class="form-field">
                        <label for="totalIngreso">Total de ingreso</label>
                        <input type="number" step="0.01" min="0" id="totalIngreso" placeholder=""
                            v-model="form.totalIngreso" required />
                    </div>


                </div>
                <div class="form-row">
                    <!-- Foto artículo -->

                    <div class="form-field">
                        <label for="fotoArticulo">Foto artículo</label>
                        <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent @click="triggerFileInput">
                            <input type="file" id="fotoArticulo" ref="fileInputExistencia" multiple @change="handleFileUpload"
                                accept="image/*" />
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span v-if="form.fotoArticulo.length === 0">Arrastra o selecciona imágenes (JPG,
                                PNG)</span>
                            <span v-else>{{ form.fotoArticulo.length }} imágenes seleccionadas</span>
                        </div>
                        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

                        <!-- Botón para abrir el modal con los nombres de las imágenes -->
                        <button v-if="form.fotoArticulo.length > 0" @click.prevent="openImageModal"
                            class="view-images-btn">
                            Ver Imágenes
                        </button>
                    </div>
                </div>


                <div class="button-container" style="gap: 30px;">
                    <button class="boton" type="submit" @click.prevent="registerExistencia('articulo')">
                        <i class="fas fa-plus-square"></i> Agregar Articulo
                    </button>
                    <button class="boton" type="submit" @click.prevent="registerExistencia('bien')">
                        <i class="fas fa-plus-square"></i> Agregar Bien
                    </button>
                </div>
            </form>
        </div>

        <!-- Modal para mostrar las imágenes y sus nombres -->
        <div v-if="showImageModal" class="modal-overlay2">
            <div class="modal2">
                <h2>Imágenes seleccionadas</h2>
                <div class="image-preview-container">
                    <!-- Vista previa de las imágenes con su nombre -->
                    <div v-for="(img, index) in form.fotoArticulo" :key="index" class="image-preview">
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
        <!-- Modal de Éxito -->
        <div v-if="modalVisible" class="modal">
            <div class="modal-content">
                <span class="close" @click="cerrarModal">&times;</span>
                <h2>¡Registro Exitoso!</h2>
                <p>La existencia ha sido agregada correctamente.</p>
                <button @click="redirigirPagina">Aceptar</button>
            </div>
        </div>


    </div>
</template>

<script>
export default {
    name: "newExistenciaPage",
    data() {
        return {
            userName: "Cargando...",
            profileImage: "",  // URL de la imagen del usuario
            form: {
                id: "",                     // ID del registro
                numeroFactura: "",          // Número de factura
                numeroPartida: "",          // Número de partida (físico/moral)
                nombre: "",                 // Nombre del artículo
                importeSinIVA: "",          // Importe sin IVA
                iva: "",                    // IVA
                importeConIVA: "",          // Importe con IVA
                cantidad: "",
                unidadmedida: "",               // Cantidad
                totalIngreso: "",           // Total de ingreso
                fotoArticulo: []         // Foto del artículo (archivo)
            },

            menus: {
                homeMenu: false,
                existenciaMenu: false,
                settingsMenu: false,
            },
            modalVisible: false, // Estado del modal
            buttonType: "",  // Agrega esta propiedad
            fotoArticulo: [],
            showImageModal: false,


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
                    const response = await fetch('http://localhost:3000/api/usuarios');
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
        openImageModal() {
            this.showImageModal = true;
        },
        // Método para cerrar el modal
        closeImageModal() {
            this.showImageModal = false;
        },
        mostrarModal() {
            this.modalVisible = true; // Muestra el modal
        },
        cerrarModal() {
            this.modalVisible = false; // Oculta el modal
        },

        goHome() {
            this.$router.push('home'); // Redirige a la página principal ("/").
        },
        handleDrop(event) {
            const file = event.dataTransfer.files[0];
            this.form.fotoArticulo = file; // Cambia "fotoArticulo" por "fotoArticulo"
        },
        triggerFileInput() {
            this.$refs.fileInputExistencia.click();
        },
        handleFileUpload(event) {
            if (!event || !event.target || !event.target.files) return;

            if (!this.form.fotoArticulo) {
                this.form.fotoArticulo = [];
            }

            const files = Array.from(event.target.files);
            const validFiles = files.filter(file => this.isImage(file));

            if (validFiles.length + this.form.fotoArticulo.length > 10) {
                this.errorMessage = "Solo puedes subir hasta 10 imágenes.";
                return;
            }

            this.form.fotoArticulo.push(...validFiles);
            this.errorMessage = "";
        },
        isImage(file) {
            return file.type.startsWith("image/");
        },
        getImageUrl(file) {
            return URL.createObjectURL(file);
        },
        removeImage(index) {
            this.form.fotoArticulo.splice(index, 1);
        },
        registerExistencia(tipo) {
            // Validar campos obligatorios
            if (
                !this.form.id ||
                !this.form.numeroFactura ||
                !this.form.numeroPartida ||
                !this.form.nombre ||
                !this.form.importeSinIVA ||
                !this.form.iva ||
                !this.form.importeConIVA ||
                !this.form.cantidad ||
                !this.form.totalIngreso
            ) {
                alert("Por favor, completa todos los campos obligatorios.");
                return;
            }

            if (!this.form.fotoArticulo) {
                alert("Por favor, agrega una foto del artículo.");
                return;
            }

            // Simulación de registro (aquí iría la lógica para guardar en la base de datos)
            console.log("Datos registrados:", this.form);

            // Guardar el tipo de registro para usarlo en la redirección
            this.buttonType = tipo;

            // Mostrar modal de éxito
            this.mostrarModal();
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
        redirigirPagina() {
            // Cerrar el modal
            this.cerrarModal();

            // Redirigir según el tipo de registro
            if (this.buttonType === 'articulo') {
                this.$router.push({ name: 'existencia' });
            } else if (this.buttonType === 'bien') {
                this.$router.push({ name: 'listaalmacen' });
            }
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


.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    color: #691B31;
}

.close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 20px;
    cursor: pointer;
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
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;


}

form {
    background: white;
    padding: 30px;
    padding-bottom: 80px;
    border-radius: 10px;
    width: 1150px;
    height: 375px;
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
</style>