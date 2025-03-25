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
                    <button @click="navigateTo('bienesnuevos')">Asignar resguardo</button>
                    <button @click="navigateTo('liberarbien')">Liberar Bien</button>
                    <button @click="navigateTo('reportes')">Generación de reportes</button>


                </div>
            </div>

            <div v-if="userRole === 'Almacenes' || userRole === 'Administrador'" class="nav-item"
                @mouseenter="showMenu('existenciaMenu')" @mouseleave="hideMenu('existenciaMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.existenciaMenu">
                    <button @click="navigateTo('solicitudmaterial')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('existencia')"
                        style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Entrada de
                        artículos</button>
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
                    <!-- Numero de partida -->
                    <div class="form-field">
                        <label for="id_objetogasto">Número de partida</label>
                        <input type="number" min="0" id="id_objetogasto" placeholder="" v-model="form.numero_partida"
                            @input="validarNumeroPartida" required />
                    </div>

                    <!-- Número de factura -->
                    <div class="form-field">
                        <label for="id_factura">Número de factura</label>
                        <input type="number" min="0" id="id_factura" placeholder="" v-model="form.id_factura"
                            required />
                    </div>

                    <!-- descripcion -->
                    <div class="form-field">
                        <label for="descripcion">descripcion</label>
                        <input type="text" id="descripcion" placeholder="" v-model="form.descripcion" required />
                    </div>
                </div>

                <div class="form-row">
                    <!-- Importe sin IVA -->
                    <div class="form-field">
                        <label for="precio_unitario">Importe sin IVA</label>
                        <input type="number" step="0.01" min="0" id="precio_unitario" placeholder=""
                            v-model="form.precio_unitario" required />
                    </div>

                    <!-- IVA -->
                    <div class="form-field">
                        <label for="iva">IVA</label>
                        <input type="number" step="0.01" min="0" id="iva" placeholder="" v-model="form.iva" required />
                    </div>

                    <!-- Importe con IVA -->
                    <div class="form-field">
                        <label for="importe_con_iva">Importe con IVA</label>
                        <input type="number" step="0.01" id="importe_con_iva" min="0" placeholder=""
                            v-model="form.importe_con_iva" required />
                    </div>

                </div>

                <div class="form-row">
                    <!-- Cantidad -->
                    <div class="form-field">
                        <label for="cantidad">Cantidad</label>
                        <input type="number" min="0" id="cantidad" placeholder="" v-model="form.cantidad" required />
                    </div>

                    <!-- Unidad de medida -->
                    <div class="form-field">
                        <label for="unidad_medida">Unidad de medida</label>
                        <select id="unidad_medida" v-model="form.unidad_medida" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="Piezas">Piezas</option>
                            <option value="Paquetes">Paquetes</option>
                            <option value="Cajas">Cajas</option>
                            <option value="Kilogramos">Kilogramos</option>
                            <option value="Litros">Litros</option>
                            <option value="Metros">Metros</option>
                            <option value="Rollos">Rollos</option>
                            <option value="Bultos">Bultos</option>
                        </select>
                    </div>




                    <!-- Total de ingreso -->
                    <div class="form-field">
                        <label for="total_ingreso">Total de ingreso</label>
                        <input type="number" step="0.01" min="0" id="total_ingreso" placeholder=""
                            v-model="form.total_ingreso" required />
                    </div>


                </div>
                <div class="form-row">
                    <!-- Foto artículo -->

                    <div class="form-field">
                        <label for="foto_articulo">Foto artículo</label>
                        <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent @click="triggerFileInput">
                            <input type="file" id="foto_articulo" ref="fileInputExistencia" multiple
                                @change="handleFileUpload" accept="image/*" />
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span v-if="form.foto_articulo.length === 0">Arrastra o selecciona imágenes (JPG,
                                PNG)</span>
                            <span v-else>{{ form.foto_articulo.length }} imágenes seleccionadas</span>
                        </div>
                        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

                        <!-- Botón para abrir el modal con los nombres de las imágenes -->
                        <button v-if="form.foto_articulo.length > 0" @click.prevent="openImageModal"
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
                    <div v-for="(img, index) in form.foto_articulo" :key="index" class="image-preview">
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
import axios from 'axios'; // Importar axios para hacer solicitudes HTTP

export default {
    name: "newExistenciaPage",
    data() {
        return {
            userRole: localStorage.getItem('userRole') || '', // Obtener el rol desde el localStorage
            userName: "Cargando...",
            profileImage: "",  // URL de la imagen del usuario
            form: {
                id_objetogasto: "", // ID del objeto de gasto (se asignará automáticamente)
                numero_partida: "", // Número de partida (ingresado por el usuario)
                id_factura: "", // Número de factura
                descripcion: "", // descripcion del artículo
                precio_unitario: "", // Importe sin IVA
                iva: "", // IVA
                importe_con_iva: "", // Importe con IVA
                cantidad: "", // Cantidad
                unidad_medida: "", // Unidad de medida
                total_ingreso: "", // Total de ingreso
                foto_articulo: [] // Foto del artículo (archivo)
            },
            objetosGasto: [], // Lista de objetos de gasto
            menus: {
                homeMenu: false,
                existenciaMenu: false,
                settingsMenu: false,
            },

            modalVisible: false, // Estado del modal
            buttonType: "",  // Tipo de registro (articulo o bien)
            showImageModal: false, // Estado del modal de imágenes
            errorMessage: "", // Mensaje de error
            numeroPartidaValido: false, // Indica si el número de partida es válido
            errorNumeroPartida: "", // Mensaje de error para el número de partida
        };
    },
    mounted() {
        this.loadUserData();
        this.loadObjetosGasto(); // Cargar los objetos de gasto al montar el componente
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
        async loadObjetosGasto() {
            try {
                const response = await axios.get('http://localhost:3000/api/objetoGastos');
                this.objetosGasto = response.data.map(objeto => {
                    if (!objeto.numero_partida) {
                        console.warn('Objeto de gasto sin número de partida:', objeto);
                    }
                    return objeto;
                });
                console.log('Objetos de gasto cargados:', this.objetosGasto); // Verificar datos
            } catch (error) {
                console.error('Error al cargar los objetos de gasto:', error);
            }
        },
        openImageModal() {
            this.showImageModal = true;
        },
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
            const files = event.dataTransfer.files;
            this.handleFileUpload({ target: { files } }); // Llama a handleFileUpload con los archivos
        },
        triggerFileInput() {
            this.$refs.fileInputExistencia.click();
        },
        handleFileUpload(event) {
            if (!event || !event.target || !event.target.files) return;

            if (!this.form.foto_articulo) {
                this.form.foto_articulo = [];
            }

            const files = Array.from(event.target.files);
            const validFiles = files.filter(file => this.isImage(file));

            if (validFiles.length + this.form.foto_articulo.length > 10) {
                this.errorMessage = "Solo puedes subir hasta 10 imágenes.";
                return;
            }

            this.form.foto_articulo.push(...validFiles);
            this.errorMessage = "";
        },
        isImage(file) {
            return file.type.startsWith("image/");
        },
        getImageUrl(file) {
            return URL.createObjectURL(file);
        },
        removeImage(index) {
            this.form.foto_articulo.splice(index, 1);
        },
        // Método para validar el número de partida
        validarNumeroPartida() {
            const numeroPartida = this.form.numero_partida.toString(); // Convertir a string

            if (!numeroPartida) {
                this.numeroPartidaValido = false;
                this.errorNumeroPartida = "El número de partida es obligatorio.";
                return false;
            }

            // Buscar el número de partida en la lista de objetos de gasto
            const objetoGasto = this.objetosGasto.find(
                (objeto) => objeto.numero_partida === numeroPartida
            );

            if (objetoGasto) {
                // Si existe, asignar el id_objetogasto y marcar como válido
                this.form.id_objetogasto = objetoGasto.id;
                this.numeroPartidaValido = true;
                this.errorNumeroPartida = "";
                return true;
            } else {
                // Si no existe, mostrar un error
                this.form.id_objetogasto = "";
                this.numeroPartidaValido = false;
                this.errorNumeroPartida = "El número de partida no existe. Verifica el número.";
                return false;
            }
        },
        async registerExistencia(tipo) {
            // Validar campos obligatorios
            const camposObligatorios = [
                { campo: 'numero_partida', mensaje: 'Número de partida' },
                { campo: 'id_factura', mensaje: 'Número de factura' },
                { campo: 'descripcion', mensaje: 'Descripcion del articulo' },
                { campo: 'precio_unitario', mensaje: 'Importe sin IVA' },
                { campo: 'iva', mensaje: 'IVA' },
                { campo: 'importe_con_iva', mensaje: 'Importe con IVA' },
                { campo: 'cantidad', mensaje: 'Cantidad' },
                { campo: 'unidad_medida', mensaje: 'Unidad de medida' },
                { campo: 'total_ingreso', mensaje: 'Total de ingreso' }
            ];

            for (const { campo, mensaje } of camposObligatorios) {
                if (!this.form[campo]) {
                    alert(`Por favor, completa el campo: ${mensaje}`);
                    return;
                }
            }

            // Validar que el número de partida sea válido
            if (!this.validarNumeroPartida()) {
                alert(this.errorNumeroPartida || "El número de partida no es válido.");
                return;
            }

            if (this.form.foto_articulo.length === 0) {
                alert("Por favor, agrega una foto del artículo.");
                return;
            }

            // Crear FormData para enviar archivos y datos
            const formData = new FormData();
            formData.append('id_objetogasto', this.form.id_objetogasto);
            formData.append('id_factura', this.form.id_factura);
            formData.append('descripcion', this.form.descripcion);
            formData.append('precio_unitario', this.form.precio_unitario);
            formData.append('iva', this.form.iva);
            formData.append('importe_con_iva', this.form.importe_con_iva);
            formData.append('cantidad', this.form.cantidad);
            formData.append('unidad_medida', this.form.unidad_medida);
            formData.append('total_ingreso', this.form.total_ingreso);

            // Agregar archivos al FormData
            this.form.foto_articulo.forEach((file) => {
                formData.append('foto_articulo', file);
            });

            try {
                const response = await axios.post('http://localhost:3000/api/articulos', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 201) {
                    this.showModal = true;
                    this.mostrarModal();
                    this.buttonType = tipo;
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                if (error.response) {
                    alert(`Error: ${error.response.data.message || 'Hubo un error al enviar el formulario.'}`);
                } else if (error.request) {
                    alert('No se recibió respuesta del servidor. Por favor, verifica tu conexión a internet.');
                } else {
                    alert('Hubo un error al configurar la solicitud. Por favor, intenta nuevamente.');
                }
            }
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
        },
        closeModal() {
            this.showModal = false;
            this.$router.push('/existencia'); // Redirigir a la página de pólizas
        },
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