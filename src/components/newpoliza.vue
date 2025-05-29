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
                <h1>Nueva Poliza</h1>
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
            <a v-if="userRole === 'Administrador'" href="users" class="nav-item">Usuarios</a>
            <div v-if="userRole === 'Almacenes' || userRole === 'Administrador'" class="nav-item" @mouseenter="showMenu('almacenMenu')"
                @mouseleave="hideMenu('almacenMenu')">
                Almacén
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.almacenMenu">
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('existencia')">Entrada de artículos</button>
                    <button @click="navigateTo('solicitudmaterial')">Salida de material</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepción de solicitudes</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
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
        </div>

        <!-- Formulario -->
        <div class="form-container">
            <form @submit.prevent="registerPoliza">
                <div class="form-row">
                    <!-- Descripción -->
                    <div class="form-field">
                        <label for="descripcion">Descripción</label>
                        <input type="text" id="descripcion" v-model="form.descripcion" required />
                    </div>

                    <!-- Cobertura -->
                    <div class="form-field">
                        <label for="cobertura">Cobertura</label>
                        <input type="text" id="cobertura" v-model="form.cobertura" required />
                    </div>

                    <!-- Tipo de Póliza -->
                    <div class="form-field">
                        <label for="tipo">Tipo de Póliza</label>
                        <select id="tipo" v-model="form.tipo" required>
                            <option value="">Seleccione un tipo</option>
                            <option value="Egresos">Egresos</option>
                            <option value="Presupuestales">Presupuestales</option>
                            <option value="Donaciones">Donaciones</option>
                            <option value="Cheques">Cheques</option>
                            <option value="Ingresos">Ingresos</option>
                            <option value="Transferencias">Transferencias</option>
                            <option value="Retenciones">Retenciones</option>
                            <option value="Depositos">Depósitos</option>
                        </select>
                    </div>

                    <!-- Calidad -->
                    <div class="form-field">
                        <label for="calidad">Calidad</label>
                        <input type="text" id="calidad" v-model="form.calidad" required />
                    </div>
                </div>

                <div class="form-row">
                    <!-- Deducible -->
                    <div class="form-field">
                        <label for="deducible">Deducible</label>
                        <input type="number" step="0.01" id="deducible" v-model="form.deducible" min="0" required />
                    </div>

                    <!-- Prima -->
                    <div class="form-field">
                        <label for="prima">Prima</label>
                        <input type="number" step="0.01" id="prima" v-model="form.prima" min="0" required />
                    </div>

                    <!-- Cantidad -->
                    <div class="form-field">
                        <label for="cantidad">Cantidad</label>
                        <input type="number" step="0.01" id="cantidad" v-model="form.cantidad" min="0" required />
                    </div>

                    <!-- Límite de indemnización -->
                    <div class="form-field">
                        <label for="limites_indemnizacion">Límite de indemnización</label>
                        <input type="text" id="limites_indemnizacion" v-model="form.limites_indemnizacion" required />
                    </div>
                </div>

                <div class="form-row">
                    <!-- Periodo de Validación -->
                    <div class="form-field">
                        <label for="periodo_vigencia">Periodo de Validación</label>
                        <input type="date" id="periodo_vigencia" v-model="form.periodo_vigencia" required />
                    </div>

                    <!-- Clausulas de exclusión -->
                    <div class="form-field">
                        <label for="clausulas_exclusion">Cláusulas de exclusión</label>
                        <input type="text" id="clausulas_exclusion" v-model="form.clausulas_exclusion" required />
                    </div>

                    <!-- Fecha de Póliza -->
                    <div class="form-field">
                        <label for="fecha">Fecha de Póliza</label>
                        <input type="date" id="fecha" v-model="form.fecha" required />
                    </div>



                    <!-- Documento de Poliza -->
                    <div class="form-field">
                        <label for="archivo">Documento de Poliza</label>
                        <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent @click="triggerFileInput">
                            <input type="file" id="archivo" ref="fileInput" @change="handleFileUpload" accept=".pdf" />
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span v-if="!form.archivo">Arrastra o selecciona un archivo (PDF)</span>
                            <span v-else>{{ form.archivo.name }}</span>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="boton" type="submit">
                        <i class="fas fa-plus"></i> Agregar Póliza
                    </button>
                </div>
            </form>
        </div>
        <!-- Modal -->
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <h2>Poliza registrada con éxito.</h2>
                <button @click="closeModal">Aceptar</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"; // Importar axios para hacer solicitudes HTTP

export default {
    name: "newPolizaPage",
    data() {
        return {
            userRole: localStorage.getItem('userRole') || '', // Obtener el rol desde el localStorage
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario
            form: {
                descripcion: "",
                cobertura: "",
                tipo: "",
                calidad: "",
                deducible: "",
                prima: "",
                cantidad: "",
                limites_indemnizacion: "",
                periodo_vigencia: "",
                clausulas_exclusion: "",
                fecha: "",
                archivo: null, // Almacena el archivo seleccionado
            },
            menus: {
                homeMenu: false,
                polizaMenu: false,
                settingsMenu: false,
            },
            showModal: false, // Controla la visibilidad del modal de éxito
            errorMessage: "", // Mensaje de error
        };
    },
    mounted() {
        this.loadUserData(); // Cargar datos del usuario al montar el componente
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
            this.$router.push('home'); // Redirige a la página principal
        },
        handleFileUpload(event) {
            const file = event.target.files[0]; // Obtener el primer archivo seleccionado
            if (file && file.type === "application/pdf") { // Validar que sea un PDF
                this.form.archivo = file; // Almacena el archivo en el formulario
                this.errorMessage = ""; // Limpiar el mensaje de error
            } else {
                this.errorMessage = "Por favor, selecciona un archivo PDF válido.";
                this.form.archivo = null; // Limpiar el archivo seleccionado
            }
        },
        handleDrop(event) {
            event.preventDefault(); // Prevenir el comportamiento por defecto
            const file = event.dataTransfer.files[0]; // Obtener el primer archivo arrastrado
            if (file && file.type === "application/pdf") { // Validar que sea un PDF
                this.form.archivo = file; // Almacena el archivo en el formulario
                this.errorMessage = ""; // Limpiar el mensaje de error
            } else {
                this.errorMessage = "Por favor, arrastra un archivo PDF válido.";
                this.form.archivo = null; // Limpiar el archivo seleccionado
            }
        },
        triggerFileInput() {
            this.$refs.fileInput.click(); // Simula un clic en el input de archivo
        },
        async registerPoliza() {
            try {
                // Validar que todos los campos obligatorios estén completos
                if (!this.form.descripcion || !this.form.cobertura || !this.form.tipo || !this.form.calidad ||
                    !this.form.deducible || !this.form.prima || !this.form.cantidad || !this.form.limites_indemnizacion ||
                    !this.form.periodo_vigencia || !this.form.clausulas_exclusion || !this.form.fecha || !this.form.archivo) {
                    this.errorMessage = "Por favor, completa todos los campos obligatorios.";
                    return;
                }

                // Crear un objeto FormData para enviar los datos del formulario
                const formData = new FormData();
                formData.append("descripcion", this.form.descripcion);
                formData.append("cobertura", this.form.cobertura);
                formData.append("tipo", this.form.tipo);
                formData.append("calidad", this.form.calidad);
                formData.append("deducible", this.form.deducible);
                formData.append("prima", this.form.prima);
                formData.append("cantidad", this.form.cantidad);
                formData.append("limites_indemnizacion", this.form.limites_indemnizacion);
                formData.append("periodo_vigencia", this.form.periodo_vigencia);
                formData.append("clausulas_exclusion", this.form.clausulas_exclusion);
                formData.append("fecha", this.form.fecha);

                // Agregar el archivo al FormData si existe
                if (this.form.archivo) {
                    formData.append("archivo", this.form.archivo);
                }

                // Enviar la solicitud POST a la API
                const response = await axios.post("http://localhost:3000/api/polizas", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data", // Especificar el tipo de contenido
                    },
                });

                // Mostrar el modal de éxito si la solicitud es exitosa
                if (response.status === 201) {
                    this.showModal = true;
                    this.errorMessage = ""; // Limpiar el mensaje de error
                }
            } catch (error) {
                console.error("Error al registrar la póliza:", error);
                if (error.response) {
                    // Mostrar el mensaje de error del servidor
                    this.errorMessage = error.response.data.message || "Hubo un error al registrar la póliza.";
                } else {
                    this.errorMessage = "Hubo un error al registrar la póliza. Por favor, inténtalo de nuevo.";
                }
            }
        },
        navigateTo(page) {
            console.log(`Navegando a ${page}`);
            this.$router.push({ name: page }); // Navegar a una página específica
        },
        showMenu(menu) {
            this.menus[menu] = true; // Mostrar el menú desplegable
        },
        hideMenu(menu) {
            this.menus[menu] = false; // Ocultar el menú desplegable
        },
        closeModal() {
            this.showModal = false;
            this.$router.push('/poliza'); // Redirigir a la página de pólizas
        },
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
    width: auto;
    height: auto;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.form-row {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
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