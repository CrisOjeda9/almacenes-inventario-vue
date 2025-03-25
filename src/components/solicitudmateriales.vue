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
                <div class="contenedor-tabla">
                    <!-- Nuevos campos agregados aquí -->
                    <div class="form-header">
                        <div class="form-field">
                            <label for="direccionSolicitante">Dirección Solicitante</label>
                            <select v-model="direccionSolicitante" required>
                                <option value="" disabled>Seleccione una dirección</option>
                                <option value="Dirección General">Dirección General</option>
                                <option value="Dirección Administrativa">Dirección Administrativa</option>
                                <option value="Dirección de Producción">Dirección de Producción</option>
                                <option value="Dirección de Noticias">Dirección de Noticias</option>
                                <option value="Dirección de Ingeniería">Dirección de Ingeniería</option>
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
                                    <input type="text" v-model="item.numeroPartida" required />
                                </td>
                                <td>
                                    <select v-model="item.unidadMedida" required>
                                        <option value="" disabled>Seleccione</option>
                                        <option value="Pieza">Pieza</option>
                                        <option value="Paquete">Paquete</option>
                                        <option value="Caja">Caja</option>
                                        <option value="Rollo">Rollo</option>
                                        <option value="Litro">Litro</option>
                                        <option value="Metro">Metro</option>
                                        <option value="Kilogramo">Kilogramo</option>
                                        <option value="Juego">Juego</option>
                                    </select>
                                </td>
                                <td>
                                    <select v-model="item.descripcionMaterial" required>
                                        <option value="" disabled>Seleccione material</option>
                                        <option value="Pilas: Duracel AA">Pilas: Duracel AA</option>
                                        <option value="Rollo: Papel de Baño">Rollo: Papel de Baño</option>
                                        <option value="Cartucho: Tinta HP 62">Cartucho: Tinta HP 62</option>
                                        <option value="Resma: Papel Bond A4">Resma: Papel Bond A4</option>
                                        <option value="Caja: Clips metálicos">Caja: Clips metálicos</option>
                                        <option value="Paquete: Plumas BIC">Paquete: Plumas BIC</option>
                                        <option value="Juego: Destornilladores">Juego: Destornilladores</option>
                                        <!-- Agrega más opciones según sea necesario -->
                                    </select>
                                </td>
                                <td>
                                    <input type="number" min="1" v-model="item.cantidadEntregada" required />
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

                <div v-if="showConfirmationModal" class="modal">
                    <div class="modal-content" style="background-color: white; color: #691b31;">
                        <h2>Salida Registrada</h2>
                        <p>La salida de materiales ha sido registrada con éxito.</p>
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
            direccionSolicitante: '',
            fechaSolicitud: new Date(),
            userRole: localStorage.getItem('userRole') || '',
            userName: "Cargando...",
            profileImage: "",
            items: [
                {
                    bien: '',
                    descripcion: '',
                    cantidad: '',
                    medida: ''
                }
            ],
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
            showConfirmationModal: false,
        };
    },
    computed: {
        fechaFormateada() {
            const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
            return this.fechaSolicitud.toLocaleDateString('es-ES', opciones);
        }
    },
    methods: {
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
                    cantidadEntregada: ''
                });
            }
        },

        updateDescripcion(index) {
            this.items[index].descripcion = this.bienDescripcion[this.items[index].bien] || '';
        },



        removeItem(index) {
            if (this.items.length > 1) {
                this.items.splice(index, 1);
            }
        },

        submitForm() {
            if (this.items.every(item => this.isCurrentRowComplete(this.items.indexOf(item)))) {
                console.log("Salida registrada:", this.items);
                this.showConfirmationModal = true;
            } else {
                alert("Por favor complete todos los campos antes de registrar la salida.");
            }
        },

        closeModal() {
            this.showConfirmationModal = false;
            this.$router.push('/recepcionsolicitudes');
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

        verSolicitudes() {
            this.$router.push('/versolicitudes');
        }
    }
};
</script>

<style scoped>
.form-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    width: 95%;

}

.form-field {
    flex: 1;
    margin-right:2%;
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
    max-height: 400px;
    overflow-y: auto;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

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
