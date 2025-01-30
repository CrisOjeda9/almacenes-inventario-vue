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
                <h1>Bien para Inventario</h1>
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
                    <button @click="navigateTo('')">Historial de bienes</button>
                    <button @click="navigateTo('home')">Alta de bienes</button>
                    <button @click="navigateTo('bajabien')">Baja de bienes</button>
                    <button @click="navigateTo('resguardo')">Mi resguardo</button>
                    <button @click="navigateTo('listaalmacen')" style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Lista Almacén para asignar No.Inventario</button>
                    <button @click="navigateTo('')">Lista Bienes con No.Inventario para asignar Usuario</button>
                    <button @click="navigateTo('')">Generación de Formatos/Reportes</button>
                    <button @click="navigateTo('bienesnuevos')">Bienes nuevos para asignar resguardo</button>
                </div>
            </div>

            <div class="nav-item" @mouseenter="showMenu('bieninventarioMenu')"
                @mouseleave="hideMenu('bieninventarioMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.bieninventarioMenu">
                    <button @click="navigateTo('bieninventario')">Solicitud de material</button>
                    <button @click="navigateTo('bieninventario')"
                        style="background-color: #ddc9a3; color: #691b31; border-radius: 4px;">Agregar un bien para
                        inventario</button>
                    <button @click="navigateTo('bieninventario')">Salida de existencias</button>
                    <button @click="navigateTo('existencia')">Entrada de existencias</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepcion de solicitudes</button>
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('poliza')">Polizas</button>
                </div>
            </div>
        </div>

        <!-- Formulario -->
        <div class="form-container">
            <form @submit.prevent="registerBien">
                <div class="form-row">
                    <!-- Tipo de inventario -->
                    <div class="form-field">
                        <label for="tipoInventario">Tipo de Inventario</label>
                        <select id="tipoInventario" v-model="form.tipoInventario" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="rth">RTH</option>
                            <option value="pg">PG</option>
                            <option value="gob">GOB</option>
                            <option value="nt">NT</option>
                            <option value="ga">GA</option>
                        </select>
                    </div>

                    <!-- Número de inventario -->
                    <div class="form-field">
                        <label for="inventario">Número de Inventario</label>
                        <input type="text" id="inventario" placeholder="Ej. Compra de material"
                            v-model="form.inventario" :disabled="form.tipoInventario === 'gob' ? false : true"
                            @input="handleInput" required />
                    </div>
                    <!-- Descripción -->
                    <div class="form-field">
                        <label for="descripcion">Descripción</label>
                        <input type="text" id="descripcion" placeholder="Ej. Compra de material"
                            v-model="form.descripcion" required />
                    </div>
                    <!-- Color -->
                    <div class="form-field">
                        <label for="color">Color</label>
                        <input type="text" id="color" placeholder="Ej. Compra de material" v-model="form.color"
                            required />
                    </div>
                </div>

                <div class="form-row">
                    <!-- Material -->
                    <div class="form-field">
                        <label for="material">Material</label>
                        <input type="text" id="material" placeholder="Ej. Compra de material" v-model="form.material"
                            required />
                    </div>
                    <!-- Marca -->
                    <div class="form-field">
                        <label for="marca">Marca</label>
                        <input type="text" id="marca" placeholder="Ej. Compra de material" v-model="form.marca"
                            required />
                    </div>
                    <!-- Modelo -->
                    <div class="form-field">
                        <label for="modelo">Modelo</label>
                        <input type="text" id="modelo" placeholder="Ej. Compra de material" v-model="form.modelo"
                            required />
                    </div>

                    <!-- Serie -->
                    <div class="form-field">
                        <label for="serie">Serie</label>
                        <input type="text" id="serie" placeholder="Ej. Compra de material" v-model="form.serie"
                            required />
                    </div>
                </div>

                <div class="form-row">
                    <!-- Tipo de posesión -->
                    <div class="form-field">
                        <label for="tipodeposesion">Tipo de posesión</label>
                        <select id="tipodeposesion" v-model="form.tipodeposesion" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="inventario">Inventario (I)</option>
                            <option value="comodato">Comodato (CO)</option>
                        </select>
                    </div>

                    <!-- Estado del bien -->
                    <div class="form-field">
                        <label for="estadobien">Estado del bien</label>
                        <select id="estadobien" v-model="form.estadobien" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="nuevo">Nuevo (N)</option>
                            <option value="bueno">Bueno (B)</option>
                            <option value="regular">Regular (RE)</option>
                            <option value="malo">Malo (M)</option>
                            <option value="inservible">Inservible (I)</option>
                        </select>
                    </div>
                </div>

                <div class="button-container">
                    <button  class="boton" type="submit">
                        <i class="fas fa-plus"></i> Agregar Bien
                    </button>
                </div>
            </form>
        </div>

    </div>
</template>

<script>
export default {
    name: "BienPage",
    data() {
        return {
            form: {
                tipoInventario: "",
                inventario: "",
                descripcion: "",
                color: "",
                material: "",
                marca: "",
                modelo: "",
                serie: "",
                tipodeposesion: "",
                estadobien: ""
            },
            inventarioCounter: 10000,  // Número de inicio para el inventario automático

            menus: {
                homeMenu: false,
                bieninventarioMenu: false,
                settingsMenu: false,
            },
        };
    },
    watch: {
        'form.tipoInventario': function (newVal) {
            if (newVal === 'gob') {
                this.form.inventario = ""; // Limpiar campo de inventario cuando se selecciona "GOB"
            } else if (newVal !== 'gob') {
                this.generateInventoryNumber(); // Generar automáticamente si no es "GOB"
            }
        },
    },
    methods: {
        generateInventoryNumber() {
            // Generar un número de inventario único de 5 dígitos (incremental)
            this.form.inventario = this.inventarioCounter.toString().padStart(5, '0');
            this.inventarioCounter++; // Incrementar para el siguiente número
        },
        handleInput() {
            // Si el tipo de inventario es "gob", dejar al usuario escribir el número.
            // Si no es "gob", evitar que el usuario lo cambie.
            if (this.form.tipoInventario !== 'gob' && this.form.inventario !== this.inventarioCounter.toString().padStart(5, '0')) {
                this.generateInventoryNumber();
            }
        },

        goHome() {
            this.$router.push('home');
        },
        goBack() {
            console.log("Regresar a la página anterior");
        },
        navigateTo(page) {
            console.log(`Navegando a ${page}`);
            this.$router.push({ name: page });
        },
        showMenu(menu) {
            this.menus[menu] = true;
        },
        hideMenu(menu) {
            this.menus[menu] = false;
        },
        registerBien() {
            // Aquí procesas el formulario y luego rediriges
            console.log("Formulario enviado:", this.form);
            this.$router.push('/bienesnuevos'); // Redirige a la vista de inicio o la vista que desees
        }
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
    width: 1000px;
    height: 250px;
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
</style>