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
                <h1>Nueva Factura</h1>
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

        <!-- Formulario -->
        <div class="form-container">
            <form @submit.prevent="submitFactura">
                <div class="form-row">
                    <!-- Tipo de alta -->
                    <div class="form-field">
                        <label for="tipoAlta">Tipo de alta</label>
                        <select id="tipoAlta" v-model="form.tipo_alta" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="Compra (CM)">Compra (CM)</option>
                            <option value="DDomacion (DN)">Donacion (DN)</option>
                            <option value="Comodato (CO)">Comodato (CO)</option>
                        </select>
                    </div>
                    <!-- Tipo de documento que ampara -->
                    <div class="form-field">
                        <label for="tipoDocumentoAmpara">Tipo de doc. que ampara</label>
                        <select id="tipoDocumentoAmpara" v-model="form.tipo_documento_ampara" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="Contrato De Comodato (CO)">Contrato de Comodato (CO)</option>
                            <option value="Comprobante Fiscal Digital por Internet (CFDI)">Comprobante Fiscal Digital
                                por
                                Internet (CFDI)</option>
                        </select>
                    </div>
                    <!-- Fecha de adquisición -->
                    <div class="form-field">
                        <label for="fechaAdquisicion">Fecha de Adquisición</label>
                        <input type="date" id="fechaAdquisicion" v-model="form.fecha_adquisicion" required />
                    </div>
                    <!-- No. Factura -->
                    <div class="form-field">
                        <label for="numero_de_factura">No. Factura</label>
                        <input type="number" min="0" id="numero_de_factura" placeholder=""
                            v-model="form.numero_de_factura" required />
                    </div>
                </div>

                <div class="form-row">
                    <!-- Tipo de Compra -->
                    <div class="form-field">
                        <label for="tipoCompra">Tipo de compra</label>
                        <select id="tipoCompra" v-model="form.tipo_compra" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="Presupuesto">Presupuesto</option>
                            <option value="Estatal">Estatal</option>
                        </select>
                    </div>
                    <!-- Concepto -->
                    <div class="form-field">
                        <label for="concepto">Concepto</label>
                        <input type="text" id="concepto" placeholder="" v-model="form.concepto" minlength="3"
                            maxlength="100" style="text-transform: uppercase;" required />
                    </div>
                    <!-- Fecha de Factura -->
                    <div class="form-field">
                        <label for="fechaFactura">Fecha de Factura</label>
                        <input type="date" id="fechaFactura" v-model="form.fecha_factura" required />
                    </div>
                    <!-- Cantidad -->
                    <div class="form-field">
                        <label for="cantidad">Cantidad</label>
                        <input type="number" min="0" id="cantidad" placeholder="" v-model="form.cantidad" required />
                    </div>
                </div>

                <div class="form-row">
                    <!-- Precio Unitario -->
                    <div class="form-field">
                        <label for="precioUnitario">Precio Unitario</label>
                        <input type="number" id="precioUnitario" step="0.01" placeholder=""
                            v-model="form.precio_unitario" min="0" required />
                    </div>
                    <!-- Subtotal -->
                    <div class="form-field">
                        <label for="subTotal">Subtotal</label>
                        <input type="number" id="subTotal" step="0.01" placeholder="" v-model="form.sub_total" min="0"
                            required />
                    </div>
                    <!-- IVA -->
                    <div class="form-field">
                        <label for="iva">IVA</label>
                        <input type="number" id="iva" step="0.01" placeholder="" v-model="form.iva" min="0" required />
                    </div>
                    <!-- Total -->
                    <div class="form-field">
                        <label for="total">Total</label>
                        <input type="number" id="total" step="0.01" placeholder="" v-model="form.total" min="0"
                            required />
                    </div>
                </div>

                <div class="form-row">
                    <!-- Proveedor -->
                    <div class="form-field">
                        <label for="id_proveedor">Proveedor</label>
                        <select id="id_proveedor" v-model="form.id_proveedor" required>
                            <option value="" disabled>Selecciona una opción</option>
                            <option v-for="proveedor in proveedores" :key="proveedor.id" :value="proveedor.id">
                                {{ proveedor.nombre }} {{ proveedor.apellidos }}
                            </option>
                        </select>
                    </div>
                    <!-- Documento de Factura -->
                    <div class="form-field">
                        <label for="archivo_pdf">Documento de Factura</label>
                        <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent @click="triggerFileInput">
                            <input type="file" id="archivo_pdf" ref="fileInput" @change="handleFileUpload"
                                accept=".pdf,.jpg,.png" />
                            <span v-if="!form.archivo_pdf">Arrastra o selecciona un archivo (PDF)</span>
                            <span v-else>{{ form.archivo_pdf.name }}</span>
                        </div>
                    </div>
                </div>

                <div class="button-container">
                    <button class="boton" type="submit">
                        <i class="fas fa-plus"></i> Agregar Factura
                    </button>
                </div>
            </form>
        </div>
        <!-- Modal -->
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <h2>Factura registrada con éxito.</h2>
                <button @click="closeModal">Aceptar</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "newFacturaPage",
    data() {
        return {
            userRole: localStorage.getItem('userRole') || '', // Obtener el rol desde el localStorage
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario
            form: {
                tipo_alta: "", // Asegúrate de que esté vacío por defecto
                tipo_documento_ampara: "", // Asegúrate de que esté vacío por defecto
                numero_de_factura: "",           // No. Factura
                tipo_compra: "", // Asegúrate de que esté vacío por defecto
                concepto: "",             // Concepto
                fecha_factura: "",         // Fecha de Factura
                id_proveedor: "",            // Proveedor
                cantidad: "",              // Cantidad
                precio_unitario: "",      // Precio Unitario
                sub_total: "",        // Subtotal
                iva: "",                 // IVA
                total: "",        // Total
                archivo_pdf: null, // Almacena el archivo seleccionado
            },

            showPassword: false,
            showConfirmPassword: false,
            menus: {
                homeMenu: false,
                facturaMenu: false,
                settingsMenu: false,
            },
            showModal: false,
            proveedores: [] // Lista de proveedores

        };
    },
    mounted() {
        this.loadUserData();
        this.fetchProveedores();

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
        async fetchProveedores() {
            try {
                const response = await fetch("http://localhost:3000/api/proveedor");
                if (!response.ok) {
                    throw new Error("Error al obtener proveedores");
                }
                const data = await response.json();
                this.proveedores = data;
            } catch (error) {
                console.error("Error al cargar los proveedores:", error);
            }
        },
        goHome() {
            this.$router.push('home'); // Redirige a la página principal ("/"). Cambia el path si es necesario.
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            this.form.archivo_pdf = file; // Almacena el archivo en el formulario
        },
        handleDrop(event) {
            const file = event.dataTransfer.files[0];
            this.form.archivo_pdf = file; // Almacena el archivo en el formulario
        },
        triggerFileInput() {
            this.$refs.fileInput.click(); // Trigger el input file cuando se hace click en la dropzone
        },
        goBack() {
            console.log("Regresar a la página anterior");
        },
        async submitFactura() {
            try {
                const formData = new FormData();

                // Normalizar el valor de tipo_alta
                const tipoAlta = this.form.tipo_alta.trim(); // Eliminar espacios adicionales
                if (!["Compra (CM)", "Domacion (DN)", "Comodato (CO)"].includes(tipoAlta)) {
                    throw new Error("El valor de tipo_alta no es válido");
                }
                formData.append('tipo_alta', tipoAlta);

                // Agregar campos al FormData
                formData.append('tipo_documento_ampara', this.form.tipo_documento_ampara);
                formData.append('fecha_adquisicion', this.form.fecha_adquisicion);
                formData.append('numero_de_factura', String(this.form.numero_de_factura)); // Convertir a cadena
                formData.append('tipo_compra', this.form.tipo_compra);
                formData.append('concepto', this.form.concepto);
                formData.append('fecha_factura', this.form.fecha_factura);
                formData.append('id_proveedor', Number(this.form.id_proveedor));
                formData.append('cantidad', parseFloat(this.form.cantidad)); // Convertir a número
                formData.append('precio_unitario', parseFloat(this.form.precio_unitario)); // Convertir a número
                formData.append('sub_total', parseFloat(this.form.sub_total)); // Convertir a número
                formData.append('iva', parseFloat(this.form.iva)); // Convertir a número
                formData.append('total', parseFloat(this.form.total)); // Convertir a número

                // Agregar el archivo PDF
                if (this.form.archivo_pdf) {
                    formData.append('archivo_pdf', this.form.archivo_pdf);
                }

                // Enviar la solicitud a la API
                const response = await fetch("http://localhost:3000/api/facturas", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json(); // Obtener detalles del error
                    console.error("Detalles del error:", errorData);
                    throw new Error(errorData.message || "Error al enviar la factura");
                }

                // Mostrar el modal de éxito
                this.showModal = true;

            } catch (error) {
                console.error("Error al enviar la factura:", error);
                alert(`Hubo un error al enviar la factura: ${error.message}`);
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
        closeModal() {
            this.showModal = false;
            this.$router.push('/factura'); // Redirige a la página de facturas
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