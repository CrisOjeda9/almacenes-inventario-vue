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
                <h1>Solicitud de Materiales</h1>
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
                    <button @click="navigateTo('resguardo')">Bienes sin resguardo</button>
                    <button @click="navigateTo('listaalmacen')">Asignar No.Inventario</button>
                    <button @click="navigateTo('bienesnuevos')">Asignar resguardo</button>
                    <button @click="navigateTo('liberarbien')">Liberar Bien</button>
                    <button @click="navigateTo('reportes')">Generación de reportes</button>


                </div>
            </div>

            <div v-if="userRole === 'Almacenes' || userRole === 'Administrador'" class="nav-item" @mouseenter="showMenu('solicitudMaterialMenu')"
                @mouseleave="hideMenu('solicitudMaterialMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.solicitudMaterialMenu">
                    <button @click="navigateTo('solicitudmaterial')"
                        style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Solicitud de
                        material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('existencia')">Entrada de artículos</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('Polizas')">Plizas</button>
                </div>
            </div>
        </div>

        <div class="form-container">
            <form @submit.prevent="addArticulo">
                <div class="form-row">
                    <div class="form-field">
                        <label for="bien">Bien/Articulo</label>
                        <select v-model="form.bien" @change="updateDescripcion" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="micrófono">Micrófono</option>
                            <option value="cámara">Cámara</option>
                            <option value="tripode">Trípode</option>
                            <option value="transmisor">Transmisor</option>
                            <option value="pantalla">Pantalla</option>
                            <option value="audio">Audio</option>
                            <option value="mezcladora">Mezcladora</option>
                            <option value="monitor">Monitor</option>
                            <option value="luces">Luces</option>
                            <option value="controlador">Controlador</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label for="descripcion">Descripción</label>
                        <input type="text" v-model="form.descripcion" readonly />
                    </div>

                    <button class="boton" type="submit">
                        <i class="fas fa-plus"></i> Agregar artículo
                    </button>

                </div>

                <div class="form-row">
                    <div class="form-field">
                        <label for="cantidad">Cantidad a solicitar</label>
                        <input type="number" min="0" v-model="form.cantidad" required />
                    </div>
                    <div class="form-field">
                        <label for="medida">Unidad de medida</label>
                        <select v-model="form.medida" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="pieza">Pieza</option>
                            <option value="metro">Metro</option>
                            <option value="litro">Litro</option>
                            <option value="kilogramo">Kilogramo</option>
                            <option value="paquete">Paquete</option>
                        </select>
                    </div>
                    <button class="boton2" type="button" @click="verSolicitudes">
                        <i class="fas fa-eye"></i> Ver solicitudes enviadas
                    </button>


                </div>

                <div class="contenedor-tabla">
                    <table class="solicitud-table">
                        <thead>
                            <tr>
                                <th style="width: 10%;">Cantidad</th>
                                <th style="width: 20%;">Unidad</th>
                                <th style="width: 60%;">Descripción</th>
                                <th style="width: 10%;">Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in articulos" :key="index">
                                <td style="width: 10%;">{{ item.cantidad }}</td>
                                <td style="width: 20%;">{{ item.unidad }}</td>
                                <td style="width: 60%;" class="descripcion">{{ item.descripcion }}</td>
                                <td class="editar" style="width: 10%;">
                                    <button type="button" @click="openEditModal(index)" class="btn-edit">
                                        <i class="fas fa-edit"></i>
                                    </button>

                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="showModal" class="modal">
                        <div class="modal-content">
                            <h2>Editar Artículo</h2>
                            <label for="cantidad">Cantidad</label>
                            <input type="number" v-model="editForm.cantidad" />
                            <label for="unidad">Unidad</label>
                            <select v-model="editForm.unidad">
                                <option value="pieza">Pieza</option>
                                <option value="metro">Metro</option>
                                <option value="litro">Litro</option>
                                <option value="kilogramo">Kilogramo</option>
                                <option value="paquete">Paquete</option>
                            </select>
                            <label for="descripcion">Descripción</label>
                            <input type="text" v-model="editForm.descripcion" />
                            <div class="button-container" style="gap:20px ;">
                                <button @click="updateArticulo">Guardar Cambios</button>
                                <button @click="showModal = false" class="cancelar">Cancelar</button>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="boton" type="button" @click="registersolicitudMaterial">
                        <i class="fas fa-user"></i> Enviar Solicitud
                    </button>
                </div>

                <div v-if="showConfirmationModal" class="modal">
                    <div class="modal-content" style="background-color: white; color: #691b31;">
                        <h2>Solicitud Enviada</h2>
                        <p>Su solicitud ha sido enviada con éxito.</p>
                        <button @click="closeModal">Aceptar</button>
                    </div>
                </div>


            </form>


        </div>
    </div>

</template>

<script>
export default {
    name: "solicitudMaterialPage",
    data() {
        return {
            userRole: localStorage.getItem('userRole') || '', // Obtener el rol desde el localStorage
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario
            form: {
                bien: '',
                cantidad: '',
                medida: '',
                descripcion: ''
            },
            bienDescripcion: {
                micrófono: "Equipo para capturar audio de alta calidad.",
                cámara: "Dispositivo utilizado para grabación de video.",
                tripode: "Soporte para estabilizar cámaras durante grabaciones.",
                transmisor: "Equipo usado para transmitir señales de audio o video.",
                pantalla: "Pantalla para visualizar contenidos audiovisuales.",
                audio: "Sistema de sonido para transmisión en vivo o grabación.",
                mezcladora: "Equipo que permite controlar los niveles de audio.",
                monitor: "Pantalla para visualización de contenido en tiempo real.",
                luces: "Iluminación profesional para grabaciones y eventos.",
                controlador: "Equipo para manejar y ajustar el flujo de señales."
            },
            menus: {
                homeMenu: false,
                solicitudMaterialMenu: false,
                settingsMenu: false,
            },
            articulos: [],
            showModal: false,
            editIndex: null,
            editForm: {
                cantidad: '',
                unidad: '',
                descripcion: ''
            },

            showConfirmationModal: false,

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
        updateDescripcion() {
            // Asignar la descripción automática según el bien seleccionado
            this.form.descripcion = this.bienDescripcion[this.form.bien] || '';
        },
        registersolicitudMaterial() {
            console.log("Solicitud de Material registrada:", this.articulos);
            this.showConfirmationModal = true;
        },
        closeModal() {
            this.showConfirmationModal = false;
            this.$router.push('/recepcionsolicitudes'); // Reemplaza con la vista correcta
        },
        openEditModal(index) {
            this.editIndex = index;
            this.editForm = { ...this.articulos[index] };
            this.showModal = true;
        },
        updateArticulo() {
            if (this.editIndex !== null) {
                this.articulos[this.editIndex] = { ...this.editForm };
                this.showModal = false;
                this.editIndex = null;
            }
        },

        addArticulo() {
            this.articulos.push({
                cantidad: this.form.cantidad,
                descripcion: this.form.descripcion,
                unidad: this.form.medida  // Asegúrate de usar "medida" aquí
            });

            // Reiniciar los valores del formulario
            this.form.cantidad = "";
            this.form.descripcion = "";
            this.form.medida = "";
        },
        goHome() {
            this.$router.push('home'); // Redirige a la página principal ("/"). Cambia el path si es necesario.
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
        verSolicitudes() {
            this.$router.push('/versolicitudes'); // Reemplaza con la ruta correcta
        },

    },
};
</script>


<style scoped>
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
    background: #691B31;
    color: white;
    padding: 20px;
    border-radius: 20px;
    width: 500px;
}

.modal-content select {
    width: 84%;
    height: 40px;
    border-radius: 20px;
}

.modal-content label {
    color: white;
    margin-top: 10px;

}

.modal-content input {
    width: 80%;
    border-radius: 20px;
    margin-bottom: 10px;
}

.close {
    float: right;
    cursor: pointer;
}

.cancelar {
    background: #98989a;
    color: white;
}

button.cancelar:hover {
    background: #6f7271;
    color: white;
}


.solicitud-table {
    width: 95%;
    height: 200px;
    border-collapse: collapse;
    background-color: white;
    color: #691B31;
    border-radius: 15px;
    overflow: hidden;
}

.solicitud-table th,
.solicitud-table td {
    padding: 10px;
    text-align: center;

}

.solicitud-table th {
    background-color: #BC955B;
    color: white;
    /* Fija los encabezados al desplazarse */
    top: 0;
    /* Fija los encabezados a la parte superior */
    z-index: 1;
    /* Asegura que los encabezados estén encima de las filas */
}

.solicitud-table tr:hover {
    background-color: #70727265;
    color: #A02142;
    transition: background-color 0.3s ease;
}

.contenedor-tabla {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    max-height: 200px;
    /* Ajusta la altura máxima antes de activar el scroll */
    margin-top: 10px;
    /* Espacio superior para separación */
}

.solicitud-table thead {
    display: table;
    /* Asegura que el encabezado se comporte como parte de la tabla */
    width: 100%;
}

.solicitud-table tbody {
    display: block;
    max-height: 150px;
    /* Ajusta esta altura según lo que necesites */
    overflow-y: auto;
    /* Activa el scroll solo para las filas */
    width: 100%;
}

.solicitud-table tbody tr {
    display: table;
    /* Asegura que cada fila se comporta correctamente */
    width: 100%;
    /* Hace que la fila ocupe el ancho total */
}

.solicitud-table td {
    word-wrap: break-word;

    /* Permite que el texto largo se ajuste dentro de la celda */
}

/* Borde en la parte inferior de las filas de inserciones */
.solicitud-table tbody tr {
    border-bottom: 1px solid #ddd;
    /* Puedes ajustar el color y grosor del borde */
}

/* Borde en la parte inferior de las filas de inserciones */
.solicitud-table tbody tr {
    border-bottom: 1px solid #bc955b;
    /* Puedes ajustar el color y grosor del borde */
}



/* Aplicar Montserrat a todo el contenido */
* {
    font-family: 'Montserrat', sans-serif;
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
    align-items: center;
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

    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    margin-top: 5px;
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






.boton {
    width: 300px;
}

.boton2 {
    width: 300px;
    background-color: #bc955b;
}

.boton2:hover {
    background: #DDC9A3;
}




.btn-edit {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border: none;
    cursor: pointer;
    width: 100%;
    height: 30px;
}

.btn-edit {
    background-color: #4CAF50;
    color: white;
    margin-bottom: 4px;
}



.btn-edit:hover {
    background-color: #45a049;
}


.editar {
    width: 200px;
}

.descripcion {
    min-width: 150px;
    /* Define un ancho mínimo */
    max-width: 400px;
    /* Define un ancho máximo */
    word-wrap: break-word;
    /* Permite dividir palabras largas */
    white-space: normal;
    /* Permite que el texto se divida en varias líneas */
}
</style>