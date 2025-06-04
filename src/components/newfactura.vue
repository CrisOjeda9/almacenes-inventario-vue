<template>
    <div class="page-wrapper">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        <NavBarPage :pageTitle="'Nueva Factura'" :showUserMenu="true" />
        <div class="container">
            <!-- Formulario -->
            <div class="form-container">
                <form @submit.prevent="submitFactura">
                    <div class="form-row">
                        <!-- Tipo de alta -->
                        <div class="form-field">
                            <label for="tipo_compra">Tipo de compra</label>
                            <select id="tipo_compra" v-model="form.tipo_compra" required>
                                <option value="" disabled>Selecciona una opción</option>
                                <option value="Directa">Directa</option>
                                <option value="Licitacion">Licitacion</option>
                                <option value="Invitacion">Invitacion</option>
                            </select>
                        </div>
                        <!-- Tipo de documento que ampara -->
                        <!-- Documento de Factura -->
                        <div class="form-field">
                            <label for="contrato_compra">Contrato de compra</label>
                            <div class="dropzone" @drop.prevent="handleDropContrato" @dragover.prevent
                                @click="triggerFileInputContrato">
                                <input type="file" id="contrato_compra" ref="fileInputContrato"
                                    @change="handleFileUploadContrato" accept=".pdf" />
                                <span v-if="!form.contrato_compra">Arrastra o selecciona un archivo (PDF)</span>
                                <span v-else>{{ form.contrato_compra.name }}</span>
                            </div>
                        </div>
                        <!-- Fecha de adquisición -->
                        <div class="form-field">
                            <label for="fechaAdquisicion">Fecha de Adquisición</label>
                            <input type="date" id="fechaAdquisicion" v-model="form.fecha_adquisicion" required />
                        </div>

                    </div>

                    <div class="form-row">
                        <!-- No. Factura -->
                        <div class="form-field">
                            <label for="numero_de_factura">No. Factura</label>
                            <input type="number" min="0" id="numero_de_factura" placeholder=""
                                v-model="form.numero_de_factura" required />
                        </div>
                        <!-- Tipo de Compra -->
                        <div class="form-field">
                            <label for="tipo_presupuesto">Tipo de Presupuesto</label>
                            <select id="tipo_presupuesto" v-model="form.tipo_presupuesto" required>
                                <option value="" disabled>Selecciona una opción</option>
                                <option value="Ingresos Propios">Ingresos Propios</option>
                                <option value="Recurso Estatal">Recurso Estatal</option>
                            </select>
                        </div>

                        <!-- Cantidad -->
                        <div class="form-field">
                            <label for="cantidad">Cantidad</label>
                            <input type="number" min="0" id="cantidad" placeholder="" v-model="form.cantidad" required />
                        </div>
                    </div>

                    <div class="form-row">

                        <!-- sub_total -->
                        <div class="form-field">
                            <label for="sub_total">Sub Total</label>
                            <input type="number" id="sub_total" step="0.01" placeholder="" v-model="form.sub_total" min="0"
                                required />
                        </div>
                        <!-- descuento -->
                        <div class="form-field">
                            <label for="descuento">Descuento</label>
                            <input type="number" id="descuento" step="0.01" placeholder="" v-model="form.descuento" min="0"
                                required />
                        </div>
                        <div class="form-field iva-field">
                            <div class="iva-checkbox-container">
                                <label for="iva_habilitado" class="checkbox-label">
                                    <input type="checkbox" id="iva_habilitado" v-model="form.iva_habilitado" />
                                    <span class="checkmark"></span>
                                </label>
                                <label for="iva">IVA (16%)</label>
                            </div>
                            <input type="number" id="iva" step="0.01" placeholder="" v-model="form.iva" readonly min="0" 
                                :style="{ backgroundColor: form.iva_habilitado ? '#dcddcd' : '#f0f0f0' }" required />
                        </div>
                    </div>

                    <div class="form-row">
                        
                        <!-- Total -->
                        <div class="form-field">
                            <label for="total">Total</label>
                            <input type="number" id="total" step="0.01" placeholder="" v-model="form.total" readonly min="0" style="background-color: #dcddcd;"
                                required />
                        </div>
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
                            <div class="dropzone" @drop.prevent="handleDropFactura" @dragover.prevent
                                @click="triggerFileInputFactura">
                                <input type="file" id="archivo_pdf" ref="fileInputFactura" @change="handleFileUploadFactura"
                                    accept=".pdf" />
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
    </div>    
</template>

<script>
import api from '../services/api';
import NavBarPage from './NavBar.vue';
export default {
    name: "newFacturaPage",
    components: {
        NavBarPage // Registrar el componente
    },
    data() {
        return {
            userRole: localStorage.getItem('userRole') || '', // Obtener el rol desde el localStorage
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario
            form: {
                tipo_compra: "", // Tipo de compra
                contrato_compra: null, // Archivo PDF del contrato de compra
                fecha_adquisicion: "", // Fecha de adquisición
                numero_de_factura: "", // Número de factura
                tipo_presupuesto: "", // Tipo de presupuesto
                id_proveedor: "", // ID del proveedor
                cantidad: "", // Cantidad
                descuento: "", // Descuento
                sub_total: "", // Subtotal
                iva_habilitado: false, // Checkbox para habilitar IVA
                iva: "", // IVA
                total: "", // Total
                archivo_pdf: null, // Archivo PDF de la factura
            },

            showPassword: false,
            showConfirmPassword: false,
            menus: {
                homeMenu: false,
                existenciaMenu: false,
                settingsMenu: false,
                userMenu: false, 
            },
            showModal: false, // Modal de éxito
            proveedores: [], // Lista de proveedores
        };
    },
    watch: {
        // Watcher para calcular el IVA y el Total cuando cambia el subtotal o el estado del IVA
        "form.sub_total": function () {
            this.calcularTotal();
        },
        "form.descuento": function () {
            this.calcularTotal();
        },
        "form.iva_habilitado": function () {
            this.calcularTotal();
        },
    },
    mounted() {
        this.loadUserData();
        this.fetchProveedores();
    },
    methods: {
        // Método para calcular el total con o sin IVA
        calcularTotal() {
            const subtotal = parseFloat(this.form.sub_total) || 0;
            const descuento = parseFloat(this.form.descuento) || 0;
            
            if (subtotal > 0) {
                const subtotalConDescuento = subtotal - descuento;
                
                if (this.form.iva_habilitado) {
                    const iva = subtotalConDescuento * 0.16; // Calcular el IVA (16% del subtotal con descuento)
                    const total = subtotalConDescuento + iva; // Calcular el Total (subtotal con descuento + IVA)
                    
                    this.form.iva = iva.toFixed(2); // Redondear a 2 decimales
                    this.form.total = total.toFixed(2); // Redondear a 2 decimales
                } else {
                    // Si el IVA no está habilitado, el total es igual al subtotal con descuento aplicado
                    this.form.iva = "0.00";
                    this.form.total = subtotalConDescuento.toFixed(2);
                }
            } else {
                // Si el subtotal no es válido, limpiar los campos
                this.form.iva = "";
                this.form.total = "";
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
        // Cargar datos del usuario
        async loadUserData() {
            const storedUserName = localStorage.getItem("userName");
            const storedUserEmail = localStorage.getItem("userEmail");

            if (storedUserName && storedUserEmail) {
                this.userName = storedUserName;

                try {
                    // Obtener todos los usuarios de la API
                    const response = await api.get('/personas');
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
                            this.profileImage = `http://192.168.10.31:3000/api/users-files/${imageFileName}`;
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

        // Obtener lista de proveedores
        async fetchProveedores() {
            try {
                const response = await fetch("http://192.168.10.31:3000/api/proveedor");
                if (!response.ok) {
                    throw new Error("Error ");
                }
                const data = await response.json();
                this.proveedores = data;
            } catch (error) {
                console.error("Error al cargar los proveedores:", error);
            }
        },

        // Manejo del archivo del contrato de compra
        handleFileUploadContrato(event) {
            const file = event.target.files[0];
            if (file && file.type === "application/pdf") {
                this.form.contrato_compra = file; // Almacena el archivo en el formulario
            } else {
                alert("Por favor, selecciona un archivo PDF válido para el contrato de compra.");
            }
        },
        handleDropContrato(event) {
            const file = event.dataTransfer.files[0];
            if (file && file.type === "application/pdf") {
                this.form.contrato_compra = file; // Almacena el archivo en el formulario
            } else {
                alert("Por favor, arrastra un archivo PDF válido para el contrato de compra.");
            }
        },
        triggerFileInputContrato() {
            this.$refs.fileInputContrato.click(); // Abre el input de archivo para el contrato
        },

        // Manejo del archivo de la factura
        handleFileUploadFactura(event) {
            const file = event.target.files[0];
            if (file && file.type === "application/pdf") {
                this.form.archivo_pdf = file; // Almacena el archivo en el formulario
            } else {
                alert("Por favor, selecciona un archivo PDF válido para la factura.");
            }
        },
        handleDropFactura(event) {
            const file = event.dataTransfer.files[0];
            if (file && file.type === "application/pdf") {
                this.form.archivo_pdf = file; // Almacena el archivo en el formulario
            } else {
                alert("Por favor, arrastra un archivo PDF válido para la factura.");
            }
        },
        triggerFileInputFactura() {
            this.$refs.fileInputFactura.click(); // Abre el input de archivo para la factura
        },

        // Envío del formulario
        async submitFactura() {
            try {
                const formData = new FormData();

                // Agregar campos al FormData
                formData.append('tipo_compra', this.form.tipo_compra);
                formData.append('fecha_adquisicion', this.form.fecha_adquisicion);
                formData.append('numero_de_factura', this.form.numero_de_factura);
                formData.append('tipo_presupuesto', this.form.tipo_presupuesto);
                formData.append('id_proveedor', this.form.id_proveedor);
                formData.append('cantidad', this.form.cantidad);
                formData.append('descuento', this.form.descuento || '0');
                formData.append('sub_total', this.form.sub_total);
                formData.append('iva_habilitado', this.form.iva_habilitado);
                formData.append('iva', this.form.iva);
                formData.append('total', this.form.total);

                // Agregar el archivo del contrato de compra
                if (this.form.contrato_compra) {
                    formData.append('contrato_compra', this.form.contrato_compra);
                }

                // Agregar el archivo de la factura
                if (this.form.archivo_pdf) {
                    formData.append('archivo_pdf', this.form.archivo_pdf);
                }

                // Enviar la solicitud a la API
                const response = await fetch("http://192.168.10.31:3000/api/facturas", {
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

        // Cerrar el modal y redirigir
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

.page-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
}

.container {
    flex: 1;
    width: 100%;
    padding: 20px;
    background-color: #f5f5f5;
    min-height: calc(100vh - 140px);
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

.iva-field {
        display: flex;
        flex-direction: column;
    }

      .iva-checkbox-container {
        display: flex;
        align-items: center;
        margin-bottom: -3px;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #333;
        margin-right: 15px;
    }

    .checkbox-label input[type="checkbox"] {
        display: none;
    }

    .checkmark {
        height: 18px;
        width: 18px;
        background-color: #fff;
        border: 2px solid #ddd;
        border-radius: 4px;
        margin-right: 8px;
        position: relative;
        transition: all 0.3s ease;
    }

    .checkbox-label:hover .checkmark {
        border-color: #007bff;
    }

    .checkbox-label input:checked ~ .checkmark {
        background-color: #007bff;
        border-color: #007bff;
    }

    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    .checkbox-label input:checked ~ .checkmark:after {
        display: block;
    }

    .checkbox-label .checkmark:after {
        left: 5px;
        top: 1px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
    }

    .iva-checkbox-container label[for="iva"] {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        margin: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .iva-checkbox-container {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        
        .checkbox-label {
            margin-right: 0;
            margin-bottom: 5px;
            font-size: 13px;
        }
    }
</style>