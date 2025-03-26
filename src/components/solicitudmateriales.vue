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
                @mouseenter="showMenu('solicitudMaterialMenu')" @mouseleave="hideMenu('solicitudMaterialMenu')">
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
            <form @submit.prevent="submitForm">
                <div class="table-actions">
                    <div class="solicitud-number">
                        <label>Núm. Solicitud:</label>
                        <input type="text" v-model="numeroSolicitud" readonly class="numero-solicitud-input" />
                    </div>
                    <button type="button" @click="goToSolicitudes" class="btn-ver-solicitudes">
                        <i class="fas fa-list"></i> Ver Solicitudes
                    </button>
                </div>
                <div class="contenedor-tabla">

                    <!-- Nuevos campos agregados aquí -->
                    <div class="form-header">
                        <div class="form-field">
                            <label for="direccionSolicitante">Dirección Solicitante</label>
                            <select v-model="direccionSolicitante" required>
                                <option value="" disabled>Seleccione una dirección</option>
                                <option v-for="direccion in direcciones" :key="direccion" :value="direccion">
                                    {{ formatDireccion(direccion) }}
                                </option>
                            </select>
                        </div>
                        <div class="form-field">
                            <label for="fechaSolicitud">Fecha de Salida</label>
                            <input type="text" v-model="fechaFormateada" readonly />
                        </div>
                    </div>
                    <table class="solicitud-table">
                        <thead>
                            <tr>
                                <th style="width: 10%;">N° Partida</th>
                                <th style="width: 15%;">Unidad Medida</th>
                                <th style="width: 50%;">Descripción del Material</th>
                                <th style="width: 15%;">Cantidad Entregada</th>
                                <th style="width: 10%;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in items" :key="index">
                                <td>
                                    <input type="text" v-model="item.numeroPartida" readonly
                                        style="background-color: #dcddcd;" />
                                </td>
                                <td>
                                    <input type="text" v-model="item.unidadMedida" readonly
                                        style="background-color: #dcddcd;" />
                                </td>
                                <td>
                                    <select v-model="item.descripcionMaterial" @change="onMaterialSelected(index)"
                                        required>
                                        <option value="" disabled>Seleccione material</option>
                                        <option v-for="articulo in materialesDisponibles" :key="articulo.id"
                                            :value="articulo.value">
                                            {{ articulo.value }}
                                        </option>
                                    </select>
                                </td>
                                <td>
                                    <input type="number" min="1" :max="item.cantidadDisponible"
                                        v-model="item.cantidadEntregada" @change="validarCantidad(index)" required
                                        :class="{ 'error-input': item.cantidadEntregada > item.cantidadDisponible }" />
                                    <span class="stock-info">Disponible: {{ item.cantidadDisponible || 0 }}</span>
                                </td>
                                <td class="acciones">
                                    <button v-if="index === items.length - 1 && isCurrentRowComplete(index)"
                                        type="button" @click="addItem" class="btn-add"
                                        :disabled="!isCurrentRowComplete(index)">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                    <button v-if="items.length > 1" type="button" @click="removeItem(index)"
                                        class="btn-delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="button-container">
                    <button class="boton" type="submit">
                        <i class="fas fa-box-open"></i> Registrar Salida
                    </button>
                </div>

                <!-- Modal de confirmación modificado -->
                <div v-if="showConfirmationModal" class="modal">
                    <div class="modal-content" style="background-color: white; color: #691b31;">
                        <h2>Salida Registrada</h2>
                        <p>La salida de materiales ha sido registrada con éxito.</p>
                        <button @click="resetAndClose">Aceptar</button>
                    </div>
                </div>
            </form>
        </div>
        <!-- Contenedor de notificaciones -->
        <div v-if="alertMessage" :class="alertClass" class="notification">
            <i :class="alertIcon"></i> {{ alertMessage }}
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "solicitudMaterialPage",
    data() {
        return {
            numeroSolicitud: '', // Nuevo campo para el número de solicitud
            nextSolicitudNumber: 0, // Para llevar el control del siguiente número

            alertMessage: "",  // Mensaje de la alerta
            alertClass: "",    // Clase de la alerta (ej. 'success' o 'error')
            alertIcon: "",     // Icono para la alerta
            articulos: [], // Lista completa de artículos con cantidades
            direccionSolicitante: '',
            direcciones: [
                "Direccion General",
                "Direccion de Coordinacion Financiera Y Planeacion",
                "Direccion de Television",
                "Direccion de Noticias",
                "Direccion de Radio",
                "Direccion de Ingenieria",
                "Direccion de Proyectos Estrategicos",
                "Organo Interno de Control",
                "Direccion de Promocion e Intercambio",
                "Direccion Juridica",
                "Direccion de Vinculacion",
                "Imagen",
                "Estaciones de Radio",
                "Estaciones de Television"
            ],
            fechaSolicitud: new Date(),
            userRole: localStorage.getItem('userRole') || '',
            userName: "Cargando...",
            profileImage: "",
            items: [{
                numeroPartida: '',
                unidadMedida: '',
                descripcionMaterial: '',
                cantidadEntregada: '',
                id_articulo: null // Nuevo campo para almacenar el ID del artículo
            }],
            menus: {
                homeMenu: false,
                solicitudMaterialMenu: false,
                settingsMenu: false,
            },
            showConfirmationModal: false,
        };
    },
    computed: {
        fechaFormateada() {
            const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
            return this.fechaSolicitud.toLocaleDateString('es-ES', opciones);
        },
        // Filtra artículos para el select de descripción
        materialesDisponibles() {
            return this.articulos.map(articulo => ({
                value: articulo.descripcion,
                id: articulo.id,
                unidadMedida: articulo.unidad_medida,
                numeroPartida: articulo.id_objetogasto
            }));
        }
    },
    async mounted() {
        await this.loadUserData();
        await this.cargarArticulos();
        await this.obtenerNumeroSolicitud(); // Obtener número al cargar

    },
    methods: {
        // Obtener el próximo número de solicitud del backend
        async obtenerNumeroSolicitud() {
            try {
                const response = await axios.get('http://localhost:3000/api/solicitudes/next-number');
                this.numeroSolicitud = response.data.currentNumber;
                this.nextSolicitudNumber = response.data.nextNumber;
            } catch (error) {
                console.error('Error al obtener número de solicitud:', error);
                // Asignar un valor por defecto si falla
                this.numeroSolicitud = '0001';
                this.nextSolicitudNumber = 2;
            }
        },
        // Formatear número con ceros a la izquierda (0001, 0002, etc.)
        formatSolicitudNumber(num) {
            return String(num).padStart(4, '0');
        },

        // Resetear formulario
        resetForm() {
            this.direccionSolicitante = '';
            this.items = [{
                numeroPartida: '',
                unidadMedida: '',
                descripcionMaterial: '',
                cantidadEntregada: '',
                id_articulo: null,
                cantidadDisponible: 0
            }];
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

            // Ocultar la alerta después de 3 segundos
            setTimeout(() => {
                this.alertMessage = "";
            }, 3000);
        },
        // Método para ir a solicitudes
        goToSolicitudes() {
            this.$router.push('/versolicitudes');
        },
        async cargarArticulos() {
            try {
                const response = await axios.get('http://localhost:3000/api/articulos');
                this.articulos = response.data;
            } catch (error) {
                console.error('Error al cargar artículos:', error);
            }
        },

        onMaterialSelected(index) {
            const selectedMaterial = this.articulos.find(a =>
                a.descripcion === this.items[index].descripcionMaterial
            );

            if (selectedMaterial) {
                this.items[index].unidadMedida = selectedMaterial.unidad_medida;
                this.items[index].numeroPartida = selectedMaterial.id_objetogasto;
                this.items[index].id_articulo = selectedMaterial.id;
                this.items[index].cantidadDisponible = selectedMaterial.cantidad;
                // Resetear cantidad solicitada al cambiar artículo
                this.items[index].cantidadEntregada = '';
            }
        },

        validarCantidad(index) {
            const item = this.items[index];
            if (item.cantidadEntregada > item.cantidadDisponible) {
                this.showAlert(`No hay suficiente stock. Disponible: ${item.cantidadDisponible}`, "error");
                item.cantidadEntregada = item.cantidadDisponible;
            }
        },

        async submitForm() {
            // Validar cantidades primero
            for (const item of this.items) {
                if (item.cantidadEntregada > item.cantidadDisponible) {
                    this.showAlert(`No hay suficiente stock para ${item.descripcionMaterial}. Disponible: ${item.cantidadDisponible}`, "error");
                    return;
                }
            }

            try {
                // Enviar todos los artículos con el mismo número de solicitud
                const solicitudes = this.items.map(item => ({
                    numero_solicitud: this.numeroSolicitud,
                    direccion_solicitante: this.direccionSolicitante,
                    id_articulo: item.id_articulo,
                    cantidad_entregada: item.cantidadEntregada
                }));

                // Enviar solicitudes
                const solicitudPromises = solicitudes.map(solicitud =>
                    axios.post('http://localhost:3000/api/solicitudes', solicitud)
                );

                await Promise.all(solicitudPromises);

                // Actualizar el número para la próxima solicitud
                this.numeroSolicitud = this.formatSolicitudNumber(this.nextSolicitudNumber);
                this.nextSolicitudNumber++;

                this.showConfirmationModal = true;

            } catch (error) {
                console.error('Error al registrar salida:', error);
                this.showAlert("Error al registrar la solicitud", "error");
            }
        },
        formatDireccion(direccion) {
            const formatMap = {
                "Direccion General": "Dirección General",
                "Direccion de Coordinacion Financiera Y Planeacion": "Coordinación Financiera y Planeación",
                "Direccion de Television": "Dirección de Televisión",
                "Direccion de Noticias": "Dirección de Noticias",
                "Direccion de Radio": "Dirección de Radio",
                "Direccion de Ingenieria": "Dirección de Ingeniería",
                "Direccion de Proyectos Estrategicos": "Proyectos Estratégicos",
                "Organo Interno de Control": "Órgano Interno de Control",
                "Direccion de Promocion e Intercambio": "Promoción e Intercambio",
                "Direccion Juridica": "Dirección Jurídica",
                "Direccion de Vinculacion": "Vinculación",
                "Imagen": "Imagen",
                "Estaciones de Radio": "Estaciones de Radio",
                "Estaciones de Television": "Estaciones de Televisión"
            };
            return formatMap[direccion] || direccion;
        },




        isCurrentRowComplete(index) {
            const item = this.items[index];
            return item.numeroPartida && item.unidadMedida &&
                item.descripcionMaterial && item.cantidadEntregada;
        },

        addItem() {
            if (this.isCurrentRowComplete(this.items.length - 1)) {
                this.items.push({
                    numeroPartida: '',
                    unidadMedida: '',
                    descripcionMaterial: '',
                    cantidadEntregada: '',
                    id_articulo: null
                });
            }
        },

        removeItem(index) {
            if (this.items.length > 1) {
                this.items.splice(index, 1);
            }
        },


        // Método para cerrar modal y limpiar formulario
        resetAndClose() {
            this.resetForm();
            this.showConfirmationModal = false;
        },

        async loadUserData() {
            const storedUserName = localStorage.getItem("userName");
            const storedUserEmail = localStorage.getItem("userEmail");

            if (storedUserName && storedUserEmail) {
                this.userName = storedUserName;

                try {
                    const response = await axios.get('http://localhost:3000/api/personas');
                    const users = response.data;
                    const user = users.find(u => u.email === storedUserEmail);

                    if (user) {
                        const fullName = `${user.nombre || storedUserName} ${user.apellidos || ""}`.trim();
                        this.userName = fullName;

                        const imagePath = user.imagen;
                        let imageFileName = imagePath.split('\\').pop();

                        if (imageFileName) {
                            imageFileName = imageFileName.split('.').slice(0, -1).join('.');
                            this.profileImage = `http://localhost:3000/api/users-files/${imageFileName}`;
                        } else {
                            this.profileImage = "../assets/UserHombre.png";
                        }
                    } else {
                        this.profileImage = "../assets/UserHombre.png";
                    }
                } catch (error) {
                    console.error('Error al cargar datos de usuario:', error);
                    this.profileImage = "../assets/UserHombre.png";
                }
            } else {
                this.userName = "Usuario desconocido";
                this.profileImage = "../assets/UserHombre.png";
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

    }
};
</script>

<style scoped>
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

.table-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    width: 100%;
}

.solicitud-number {
    display: flex;
    align-items: center;
    gap: 10px;
}

.solicitud-number label {
    margin: 0;
    font-weight: bold;
    color: #691B31;
    white-space: nowrap;
}

.numero-solicitud-input {
    padding: 8px 12px;
    border: 1px solid #BC955B;
    border-radius: 8px;
    background-color: #f5f5f5;
    color: #691B31;
    font-weight: bold;
    width: 50px;
    text-align: center;
}

.btn-ver-solicitudes {
    background: #870f33;
    color: white;
    border: none;
    border-radius: 25px;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.3s;
}

.btn-ver-solicitudes:hover {
    background: #590d22;
}

.btn-ver-solicitudes i {
    font-size: 14px;
}

.btn-ver-solicitudes {
    width: 200px;
    background: #870f33;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
}

.error-input {
    border: 2px solid red;
}

.stock-info {
    font-size: 0.8em;
    color: #666;
    display: block;
}

.stock-warning {
    color: red;
    font-weight: bold;
}

.form-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    width: 95%;

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

.form-field {
    flex: 1;
    margin-right: 2%;
}

.form-field label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #691B31;
}

.form-field select,
.form-field input {
    width: 100%;
    padding: 10px;
    border: 1px solid #BC955B;
    border-radius: 8px;
    background-color: white;
    color: #691B31;
}

.form-field input[readonly] {
    background-color: #f5f5f5;
    cursor: not-allowed;
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
    z-index: 1;
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

.solicitud-table {
    width: 95%;
    border-collapse: collapse;
    background-color: white;
    color: #691B31;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 20px;
}

.solicitud-table th,
.solicitud-table td {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}

.solicitud-table th {
    background-color: #BC955B;
    color: white;
    position: sticky;
    top: 0;
    z-index: 1;
}

.solicitud-table tr:hover {
    background-color: #f5f5f5;
}

.solicitud-table input,
.solicitud-table select {
    width: 90%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.contenedor-tabla {
    width: 100%;
    height: 350px;
    overflow-y: auto;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Centra horizontalmente */
    justify-content: flex-start;
    /* Alinea el contenido arriba */
}

.btn-add,
.btn-delete {
    padding: 5px 10px;
    margin: 0 2px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-add {
    background-color: #4CAF50;
    color: white;
}

.btn-delete {
    background-color: #f44336;
    color: white;
}

.btn-add:hover {
    background-color: #45a049;
}

.btn-delete:hover {
    background-color: #d32f2f;
}

/* Resto de tus estilos existentes... */
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

.sub-navbar {
    display: flex;
    justify-content: center;
    background: linear-gradient(to right, #FFFFFF, #DDC9A3);
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

.form-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 0;
}

form {
    background: white;
    padding: 30px;
    border-radius: 10px;
    width: 1150px;
    max-height: 500px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.button-container {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

.boton {
    width: 300px;
    padding: 15px;
    background: #870f33;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
}

.boton:hover {
    background: #590d22;
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
</style>
