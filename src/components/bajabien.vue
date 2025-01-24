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
                <h1>Baja del Bien</h1>
                <p>Sistema inventario y Almacén de Radio y Televisión de Hidalgo</p>
            </div>
            <div class="navbar-right">
                <div class="user-profile">
                    <img src="../assets/UserHombre.png" alt="User Profile" class="profile-pic" />
                    <div class="user-info">
                        <p>Random user xd</p>
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
                    <button @click="navigateTo('home')">Alta de bienes</button>
                    <button @click="navigateTo('bajabien')" style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Mi resguardo</button>
                    <button @click="navigateTo('factura')">Asignar un bien</button>


                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('usersMenu')" @mouseleave="hideMenu('usersMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.usersMenu">
                    <button @click="navigateTo('users')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')">Agregar un bien para inventario</button>
                    <button @click="navigateTo('users')">Salida de existencias</button>
                    <button @click="navigateTo('existencia')">Entrada de existencias</button>
                    <button @click="navigateTo('users')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('poliza')">Polizas</button>
                </div>
            </div>
        </div>

        <!-- Formulario -->
        <div class="form-container">
            <form @submit.prevent="registerbajaBien">
                <div class="form-row">
                    <!-- Fecha de Baja -->
        <div class="form-field">
          <label for="fechaBaja">Fecha de Baja</label>
          <input type="date" id="fechaBaja" v-model="form.fechaBaja" required />
        </div>


        <!-- Tipo de Baja -->
        <div class="form-field">
          <label for="tipoBaja">Tipo de Baja</label>
          <select id="tipoBaja" v-model="form.tipoBaja" required>
            <option value="" disabled>Seleccione un tipo</option>
            <option value="Definitiva">Definitiva</option>
            <option value="Temporal">Temporal</option>
          </select>
        </div>

         <!-- Descripción -->
        <div class="form-field">
          <label for="descripcion">Descripción</label>
          <input
            type="text"
            id="descripcion"
            placeholder="Ej. Computadora de escritorio"
            v-model="form.descripcion"
            required
          />
        </div>

                </div>

                <div class="form-row">
                    

                <!-- Unidad Presupuestal -->
        <div class="form-field">
          <label for="unidadPresupuestal">Unidad Presupuestal</label>
          <input
            type="text"
            id="unidadPresupuestal"
            value="RADIO Y TELEVISIÓN DE HIDALGO"
            readonly
          />
        </div>

         <!-- Órgano Superior -->
         <div class="form-field">
          <label for="organoSuperior">Órgano Superior</label>
          <input
            type="text"
            id="organoSuperior"
            value="Organismo Descentralizado"
            readonly
          />
        </div>
        <!-- Marca -->
        <div class="form-field">
          <label for="marca">Marca</label>
          <input
            type="text"
            id="marca"
            placeholder="Ej. Dell, HP"
            v-model="form.marca"
            required
          />
        </div>
                </div>

                <div class="form-row">
                    

                    <!-- Documentos de Baja -->
                    <div class="form-field">
                        <label for="documentoAmpara">Documento que amapara la baja</label>
                        <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent @click="triggerFileInput">
                            <input type="file" id="documentoAmpara" ref="fileInput" @change="handleFileUpload"
                                accept=".pdf,.jpg,.png" />
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span v-if="!form.documentoAmpara">Arrastra o selecciona un archivo (PDF, JPG, PNG)</span>
                            <span v-else>{{ form.documentoAmpara.name }}</span>
                        </div>
                    </div>

                    <div class="form-field">
                        <label for="oficioSolicitud">Oficio de solicitud de dictamen</label>
                        <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent @click="triggerFileInput">
                            <input type="file" id="oficioSolicitud" ref="fileInput" @change="handleFileUpload"
                                accept=".pdf,.jpg,.png" />
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span v-if="!form.oficioSolicitud">Arrastra o selecciona un archivo (PDF, JPG, PNG)</span>
                            <span v-else>{{ form.oficioSolicitud.name }}</span>
                        </div>
                    </div>
                    <div class="form-field">
                        <label for="fotoBien">Foto del bien cuando se da de baja</label>
                        <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent @click="triggerFileInput">
                            <input type="file" id="fotoBien" ref="fileInput" @change="handleFileUpload"
                                accept=".pdf,.jpg,.png" />
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span v-if="!form.fotoBien">Arrastra o selecciona un archivo (PDF, JPG, PNG)</span>
                            <span v-else>{{ form.fotoBien.name }}</span>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <button class="boton" type="submit">
                        <i class="fas fa-plus"></i> Agregar Baja
                    </button>
                </div>
            </form>
        </div>

    </div>
</template>

<script>
export default {
  name: "bajaBienPage",
  data() {
    return {
      form: {
        fechaBaja: "",
        tipoBaja: "",
        descripcion: "",
        marca: "",
        documentoAmpara: null,
        oficioDictamen: null,
        fotoBien: null,
      },
      menus: {
        homeMenu: false,
      },
    };
  },
  methods: {
    goHome() {
      this.$router.push("/home");
    },
    handleFileUpload(field) {
      const file = event.target.files[0];
      this.form[field] = file;
    },
    registerBajaBien() {
      console.log("Formulario enviado:", this.form);
      alert("Baja registrada correctamente.");
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
  },
};
</script>


<style scoped>
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
    z-index: 10;
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
    padding: 40px;
    padding-bottom: 90px;
    border-radius: 10px;
    width: 800px;
    height: 350px;
    max-width: 800px;
    color: black;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.form-row {
    display: flex;
    justify-content: center;
    margin-bottom: 25px;
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

.form-field {
    padding-left: 3%;
    padding-right: 6%;
}


a {
    text-decoration: none;
}



.form-field select {
    width: 100%;
    max-width: 200px;
    position: relative;
    font-size: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: white;
    color: #333;
    height: 40px;
    /* Asegura que tenga la misma altura que los inputs */
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
</style>