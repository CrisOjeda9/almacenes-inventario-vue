<template>
    <div class="page-wrapper">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        <NavBarPage :pageTitle="'Entrada de Artículos'" :showUserMenu="true" />
        <div class="container">
            <div class="content-wrapper">
                <div class="form-table-container">
                    <div class="form-section">
                        <form @submit.prevent="addToTable">
                            <!-- Primera fila (3 campos) -->
                            <div class="form-row triple">
                                <div class="form-field">
                                    <label for="id_objetogasto">Número de partida</label>
                                    <input type="number" min="0" id="id_objetogasto" v-model="form.numero_partida"
                                        @input="validarNumeroPartida" required />
                                </div>
                                <div class="form-field">
                                    <label for="id_factura">Número de factura</label>
                                    <input type="text" id="id_factura" v-model="form.numero_de_factura"
                                        @blur="validarNumeroFactura" :disabled="facturaBloqueada !== null" required />
                                    <span v-if="facturaBloqueada !== null" class="factura-bloqueada-nota">
                                    </span>
                                </div>
                                <div class="form-field">
                                    <label for="cantidad">Cantidad</label>
                                    <input type="number" min="0" id="cantidad" v-model="form.cantidad" required />
                                </div>

                            </div>

                            <!-- Descripción (fila completa) -->
                            <div class="form-row single">
                                <div class="form-field full-width">
                                    <label for="descripcion">Descripción</label>
                                    <input type="text" id="descripcion" v-model="form.descripcion" required />
                                </div>
                            </div>

                            <div class="form-row triple">
                                <div class="form-field">
                                    <label for="precio_unitario">Precio Unitario (Sin IVA)</label>
                                    <input type="number" step="0.01" min="0" id="precio_unitario"
                                        v-model="form.precio_unitario" @input="calcularTotales" required />
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

                            <div class="form-row ">
                                <div class="form-field">
                                    <label for="importe_con_iva">Importe (Con IVA)</label>
                                    <input type="number" step="0.01" min="0" id="importe_con_iva"
                                        v-model="form.importe_con_iva" readonly required
                                        style="background-color: #dcddcd;" />
                                </div>
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
                                <div class="form-field">
                                    <label for="total_ingreso">Total de ingreso</label>
                                    <input type="number" step="0.01" min="0" id="total_ingreso" v-model="form.total_ingreso"
                                        style="background-color: #dcddcd;" readonly required />
                                </div>
                                <div class="form-field"></div>
                            </div>

                            <!-- Foto artículo (fila completa) -->
                            <div class="form-row single">
                                <div class="form-field full-width">
                                    <label for="foto_articulo">Foto artículo</label>
                                    <div class="dropzone" @drop.prevent="handleDrop" @dragover.prevent
                                        @click="triggerFileInput">
                                        <input type="file" id="foto_articulo" ref="fileInputExistencia" multiple
                                            @change="handleFileUpload" accept="image/*" />
                                        <i class="fas fa-cloud-upload-alt"></i>
                                        <span v-if="form.foto_articulo.length === 0">Arrastra o selecciona imágenes (JPG,
                                            PNG)</span>
                                        <span v-else>{{ form.foto_articulo.length }} imágenes seleccionadas</span>
                                    </div>
                                    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

                                    <button v-if="form.foto_articulo.length > 0" @click.prevent="openImageModal"
                                        class="view-images-btn">
                                        Ver Imágenes
                                    </button>
                                </div>
                            </div>

                            <div class="button-container">
                                <button class="boton" type="submit">
                                    <i class="fas fa-plus-square"></i> Agregar a Tabla
                                </button>
                            </div>
                        </form>
                    </div>

                    <!-- Tabla (derecha) -->
                    <div class="table-section">
                        <h2>Artículos a Registrar</h2>
                        <div class="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>No. Partida</th>
                                        <th>Descripción</th>
                                        <th>Cantidad</th>
                                        <th>Unidad</th>
                                        <th>Total</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(articulo, index) in articulosTabla" :key="index">
                                        <td>{{ articulo.numero_partida }}</td>
                                        <td>{{ articulo.descripcion }}</td>
                                        <td>{{ articulo.cantidad }}</td>
                                        <td>{{ articulo.unidad_medida }}</td>
                                        <td>${{ formatCurrency(articulo.total_ingreso) }}</td>

                                        <td>
                                            <button @click="showDeleteModal(index)" class="delete-btn">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>

                                <tfoot>
                                    <tr class="total-row">
                                        <td colspan="4" class="text-right"><strong>Total General:</strong></td>
                                        <td><strong>${{ formatCurrency(totalGeneral) }}</strong></td>
                                    </tr>
                                </tfoot>

                            </table>

                        </div>
                        <div class="table-actions">
                            <button @click="registerAllArticles" class="register-btn"
                                :disabled="articulosTabla.length === 0">
                                <i class="fas fa-save"></i> Registrar Artículos
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal para mostrar las imágenes -->
            <div v-if="showImageModal" class="modal-overlay2">
                <div class="modal2">
                    <h2>Imágenes seleccionadas</h2>
                    <div class="image-preview-container">
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
                    <p>Los artículos han sido registrados correctamente.</p>
                    <button @click="redirigirPagina">Aceptar</button>
                </div>
            </div>
            <!-- Contenedor de notificaciones -->
            <div v-if="alertMessage" :class="alertClass" class="notification">
                <i :class="alertIcon"></i> {{ alertMessage }}
            </div>
            <!-- Modal de Confirmación de Eliminación -->
            <div v-if="isDeleteModalVisible" class="modal-overlay">
                <div class="modal-content-delete">
                    <h3>¿Estás seguro de eliminar este artículo?</h3>
                    <div class="modal-buttons">
                        <button @click="confirmDelete" class="btn-confirm">Confirmar</button>
                        <button @click="cancelDelete" class="btn-cancel">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</template>

<script>
import api from '../services/api';
import NavBarPage from './NavBar.vue';
export default {
    name: "newExistenciaPage",
    components: {
        NavBarPage // Registrar el componente
    },
    data() {
        return {

            alertMessage: "",  // Mensaje de la alerta
            alertClass: "",    // Clase de la alerta (ej. 'success' o 'error')
            alertIcon: "",     // Icono para la alerta
            userRole: localStorage.getItem('userRole') || '',
            userName: "Cargando...",
            profileImage: "",
            isDeleteModalVisible: false,
            deleteIndex: null,
            form: {
                id_objetogasto: "",
                numero_partida: "",
                id_factura: "",
                numero_de_factura: "",
                descripcion: "",
                precio_unitario: "",
                descuento: "",
                iva_habilitado: false, // Checkbox para habilitar IVA
                iva: "",
                importe_con_iva: "",
                cantidad: "",
                unidad_medida: "",
                total_ingreso: "",
                foto_articulo: []
            },
            objetosGasto: [],
            facturas: [],
            menus: {
                homeMenu: false,
                existenciaMenu: false,
                settingsMenu: false,
                userMenu: false,
            },
            modalVisible: false,
            buttonType: "",
            showImageModal: false,
            errorMessage: "",
            numeroPartidaValido: false,
            errorNumeroPartida: "",
            errorNumeroFactura: "", // Nuevo mensaje de error
            numeroFacturaValido: false, // Nuevo estado de validación
            articulosRecientes: [],
            articulosTabla: [],
            facturaBloqueada: null, // Almacena el número de factura bloqueada


        };
    },
    watch: {
        // Recalcular totales cuando cambia el precio unitario
        "form.precio_unitario": function () {
            this.calcularTotales();
        },
        // Recalcular totales cuando cambia el descuento
        "form.descuento": function () {
            this.calcularTotales();
        },
        // Recalcular totales cuando se habilita/deshabilita el IVA
        "form.iva_habilitado": function () {
            this.calcularTotales();
        },
        // Recalcular total de ingreso cuando cambia la cantidad
        "form.cantidad": function () {
            this.calcularTotalIngreso();
        },
        // Recalcular total de ingreso cuando cambia el importe con IVA
        "form.importe_con_iva": function () {
            this.calcularTotalIngreso();
        }
    },
    mounted() {
        this.loadUserData();
        this.loadObjetosGasto();
        this.loadFacturas();
    },
    computed: {
        totalGeneral() {
            return this.articulosTabla.reduce((sum, articulo) => {
                return sum + (parseFloat(articulo.total_ingreso) || 0);
            }, 0);
        }
    },
    methods: {

        calcularTotales() {
            const precioUnitario = parseFloat(this.form.precio_unitario) || 0;
            const descuento = parseFloat(this.form.descuento) || 0;
            
            if (precioUnitario > 0) {
                // Aplicar descuento al precio unitario
                const precioConDescuento = precioUnitario - descuento;
                
                if (this.form.iva_habilitado) {
                    // Calcular IVA sobre el precio con descuento
                    const iva = precioConDescuento * 0.16;
                    const importeConIva = precioConDescuento + iva;
                    
                    this.form.iva = iva.toFixed(2);
                    this.form.importe_con_iva = importeConIva.toFixed(2);
                } else {
                    // Sin IVA
                    this.form.iva = "0.00";
                    this.form.importe_con_iva = precioConDescuento.toFixed(2);
                }
                
                // Actualizar total ingreso
                this.calcularTotalIngreso();
            } else {
                // Limpiar campos si no hay precio unitario
                this.form.iva = '';
                this.form.importe_con_iva = '';
                this.form.total_ingreso = '';
            }
        },

        calcularTotalIngreso() {
            const cantidad = parseFloat(this.form.cantidad) || 0;
            const importeConIva = parseFloat(this.form.importe_con_iva) || 0;
            
            if (cantidad > 0 && importeConIva > 0) {
                this.form.total_ingreso = (cantidad * importeConIva).toFixed(2);
            } else {
                this.form.total_ingreso = '';
            }
        },
        formatCurrency(value) {
            return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
        async addToTable() {
            // Validar campos obligatorios primero
            if (!this.validarCampos()) return;

            // Validar número de partida
            if (!this.validarNumeroPartida()) {
                this.showAlert(this.errorNumeroPartida || "El número de partida no es válido.", "error");
                return;
            }

            // Validar número de factura
            if (!this.validarNumeroFactura()) {
                this.showAlert(this.errorNumeroFactura || "El número de factura no es válido.", "error");
                return;
            }

            // Bloquear factura al primer artículo
            if (this.articulosTabla.length === 0) {
                this.facturaBloqueada = this.form.numero_de_factura;
            }

            // Validar que coincida con factura bloqueada
            if (this.facturaBloqueada && this.form.numero_de_factura !== this.facturaBloqueada) {
                this.showAlert(`Todos los artículos deben ser de la factura ${this.facturaBloqueada}`, "error");
                return;
            }

            // Resto de la lógica de agregar artículo...
            const factura = this.facturas.find(f => f.numero_de_factura === this.form.numero_de_factura);

            if (!factura) {
                this.showAlert("No se encontró la factura correspondiente", "error");
                return;
            }

            // Validar unidades contra factura
            const unidadesEnTabla = this.articulosTabla.reduce((sum, art) => sum + parseFloat(art.cantidad), 0);
            const unidadesNuevas = parseFloat(this.form.cantidad);
            const unidadesTotales = unidadesEnTabla + unidadesNuevas;
            const unidadesFactura = parseFloat(factura.cantidad);

            if (unidadesTotales > unidadesFactura) {
                this.showAlert(
                    `Límite de unidades excedido: Factura tiene ${unidadesFactura} unidades.\n` +
                    `En tabla: ${unidadesEnTabla}`,
                    "error"
                );
                return;
            }

            // Validar que hay imágenes
            if (this.form.foto_articulo.length === 0) {
                this.showAlert("Debes agregar al menos una imagen del artículo", "error");
                return;
            }

            // Crear nuevo artículo
            const nuevoArticulo = {
                id_objetogasto: this.form.id_objetogasto,
                id_factura: factura.id,
                numero_partida: this.form.numero_partida,
                numero_de_factura: this.form.numero_de_factura,
                descripcion: this.form.descripcion,
                precio_unitario: parseFloat(this.form.precio_unitario),
                iva: parseFloat(this.form.iva),
                importe_con_iva: parseFloat(this.form.importe_con_iva),
                cantidad: unidadesNuevas,
                unidad_medida: this.form.unidad_medida,
                total_ingreso: parseFloat(this.form.total_ingreso),
                foto_articulo: [...this.form.foto_articulo]
            };

            // Agregar a tabla
            this.articulosTabla.push(nuevoArticulo);

            // Mostrar notificación
            const disponibles = unidadesFactura - unidadesTotales;
            this.showAlert(
                `Artículo agregado (${unidadesTotales}/${unidadesFactura} unidades)` +
                `${disponibles > 0 ? ` | Disponibles: ${disponibles}` : ''}`,
                "success"
            );

            // Resetear formulario (manteniendo factura)
            this.resetForm(true);
        },

       // Método para actualizar la cantidad y total de la factura
        async updateFacturaCantidad(facturaId, nuevaCantidad, nuevoTotal = null) {
            try {
                const updateData = {
                    cantidad: nuevaCantidad
                };
                
                // Si se proporciona un nuevo total, incluirlo en la actualización
                if (nuevoTotal !== null) {
                    updateData.total = nuevoTotal;
                }

                const response = await api.put(`/facturas/${facturaId}`, updateData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (response.status === 200) {
                    console.log('Factura actualizada correctamente');
                    return true;
                }
            } catch (error) {
                console.error('Error al actualizar la factura:', error);
                return false;
            }
        },

        // Método registerExistencia actualizado
        async registerExistencia(tipo) {
            // Validar campos obligatorios
            const camposObligatorios = [
                { campo: 'numero_partida', mensaje: 'Número de partida' },
                { campo: 'numero_de_factura', mensaje: 'Número de factura' },
                { campo: 'descripcion', mensaje: 'Descripción del artículo' },
                { campo: 'precio_unitario', mensaje: 'Importe sin IVA' },
                { campo: 'iva', mensaje: 'IVA' },
                { campo: 'importe_con_iva', mensaje: 'Importe con IVA' },
                { campo: 'cantidad', mensaje: 'Cantidad' },
                { campo: 'unidad_medida', mensaje: 'Unidad de medida' },
                { campo: 'total_ingreso', mensaje: 'Total de ingreso' }
            ];

            for (const { campo, mensaje } of camposObligatorios) {
                if (!this.form[campo]) {
                    this.showAlert(`Por favor, completa el campo: ${mensaje}`, "error");
                    return;
                }
            }

            // Validar que el número de partida sea válido
            if (!this.validarNumeroPartida()) {
                this.showAlert(this.errorNumeroPartida || "El número de partida no es válido.", "error");
                return;
            }

            // Validar que el número de factura sea válido
            if (!await this.validarNumeroFactura()) {
                this.showAlert(this.errorNumeroFactura || "El número de factura no es válido.", "error");
                return;
            }

            if (this.form.foto_articulo.length === 0) {
                this.showAlert("Por favor, agrega una foto del artículo.", "error");
                return;
            }

            // Obtener la factura actual para calcular la nueva cantidad
            const facturaActual = this.facturas.find(f => f.id == this.form.id_factura);
            if (!facturaActual) {
                this.showAlert("No se encontró la factura correspondiente", "error");
                return;
            }

            // Crear FormData para enviar archivos y datos
            const formData = new FormData();
            formData.append('id_objetogasto', this.form.id_objetogasto);
            formData.append('id_factura', this.form.id_factura);
            formData.append('numero_de_factura', this.form.numero_de_factura);
            formData.append('numero_partida', this.form.numero_partida);
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
                // Registrar el artículo
                const response = await api.post('/articulos', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.status === 201) {
                    // Calcular nueva cantidad y total de la factura
                    const cantidadUsada = parseFloat(this.form.cantidad);
                    const totalUsado = parseFloat(this.form.total_ingreso);
                    const cantidadActual = parseFloat(facturaActual.cantidad);
                    const totalActual = parseFloat(facturaActual.total);
                    
                    const nuevaCantidad = Math.max(0, cantidadActual - cantidadUsada);
                    const nuevoTotal = Math.max(0, totalActual - totalUsado);

                    // Actualizar la cantidad y total en la factura
                    const facturaActualizada = await this.updateFacturaCantidad(
                        this.form.id_factura, 
                        nuevaCantidad, 
                        nuevoTotal
                    );
                    this.showModal = true;
                    this.mostrarModal();
                    this.buttonType = tipo;

                    if (facturaActualizada) {
                        // Actualizar la factura en el array local
                        const index = this.facturas.findIndex(f => f.id == this.form.id_factura);
                        if (index !== -1) {
                            this.facturas[index].cantidad = nuevaCantidad;
                            this.facturas[index].total = nuevoTotal;
                            
                            // Si la cantidad llega a 0, marcar como completamente registrada
                            if (nuevaCantidad === 0) {
                                this.facturas[index].registrada_completa = true;
                            }
                        }
                        
                        this.showAlert(
                            `Artículo registrado exitosamente. Cantidad restante: ${nuevaCantidad}, Total restante: $${nuevoTotal.toFixed(2)}`, 
                            "success"
                        );
                    } else {
                        this.showAlert("Artículo registrado, pero hubo un error al actualizar la factura", "warning");
                    }

                    // Mostrar modal y configurar redirección
                    this.showModal = true;
                    this.mostrarModal();
                    this.buttonType = tipo;
                    
                    // Limpiar formulario
                    this.resetForm();
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                if (error.response) {
                    this.showAlert(`Error: ${error.response.data.message || 'Hubo un error al enviar el formulario.'}`, "error");
                } else if (error.request) {
                    this.showAlert('No se recibió respuesta del servidor. Por favor, verifica tu conexión a internet.', 'error');
                } else {
                    this.showAlert('Hubo un error al configurar la solicitud. Por favor, intenta nuevamente.', "error");
                }
            }
        },

        // Método registerAllArticles actualizado
        async registerAllArticles() {
            try {
                if (this.articulosTabla.length === 0) {
                    this.showAlert("No hay artículos para registrar", "error");
                    return;
                }

                const numeroFactura = this.articulosTabla[0].numero_de_factura;
                const factura = this.facturas.find(f => f.numero_de_factura === numeroFactura);

                if (!factura) {
                    this.showAlert("No se encontró la factura correspondiente", "error");
                    return;
                }

                // Validar unidades totales
                const unidadesTotales = this.articulosTabla.reduce((sum, art) => sum + parseFloat(art.cantidad), 0);
                const unidadesFactura = parseFloat(factura.cantidad);

                if (Math.abs(unidadesTotales - unidadesFactura) > 0.01) {
                    this.showAlert(
                        `Error en unidades: Factura tiene ${unidadesFactura} | Tabla tiene ${unidadesTotales}`,
                        "error"
                    );
                    return;
                }

                // Validar total monetario
                const totalFactura = parseFloat(factura.total);
                const diferenciaTotal = Math.abs(this.totalGeneral - totalFactura);

                if (diferenciaTotal > 0.01) {
                    this.showAlert(
                        `Error en total: Factura $${totalFactura} | Tabla $${this.totalGeneral}`,
                        "error"
                    );
                    return;
                }

                // Enviar artículos
                const requests = this.articulosTabla.map(articulo => {
                    const formData = new FormData();

                    Object.entries(articulo).forEach(([key, value]) => {
                        if (key === 'foto_articulo') {
                            articulo.foto_articulo.forEach(file => {
                                formData.append('foto_articulo', file);
                            });
                        } else {
                            formData.append(key, value);
                        }
                    });

                    return api.post('/articulos', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                });

                const responses = await Promise.all(requests);

                if (responses.every(r => r.status === 201)) {
                    // Actualizar la cantidad y total de la factura a 0 (ya que se registraron todos los artículos)
                    const facturaActualizada = await this.updateFacturaCantidad(factura.id, 0, 0);
                    
                    if (facturaActualizada) {
                        // Actualizar la factura en el array local
                        const index = this.facturas.findIndex(f => f.id == factura.id);
                        if (index !== -1) {
                            this.facturas[index].cantidad = 0;
                            this.facturas[index].total = 0;
                            this.facturas[index].registrada_completa = true; // Marcar como completamente registrada
                        }
                    }

                    this.mostrarModal();
                    this.articulosTabla = [];
                    this.facturaBloqueada = null;
                    this.resetForm();
                    this.showAlert("Artículos registrados exitosamente. Factura completamente procesada.", "success");
                }
            } catch (error) {
                console.error('Error:', error);
                this.showAlert('Error al registrar artículos', "error");
            }
        },
        resetForm(keepFactura = false) {
            this.form = {
                id_objetogasto: "",
                numero_partida: "",
                id_factura: keepFactura ? this.form.id_factura : "",
                numero_de_factura: keepFactura ? this.facturaBloqueada : "",
                descripcion: "",
                precio_unitario: "",
                iva: "",
                importe_con_iva: "",
                cantidad: "",
                unidad_medida: "",
                total_ingreso: "",
                foto_articulo: []
            };
        },

        showDeleteModal(index) {
            this.deleteIndex = index;
            this.isDeleteModalVisible = true;
        },

        confirmDelete() {
            if (this.deleteIndex !== null) {
                this.articulosTabla.splice(this.deleteIndex, 1);
                this.showAlert('Artículo retirado correctamente', 'success');
            }
            this.cancelDelete();
        },

        cancelDelete() {
            this.isDeleteModalVisible = false;
            this.deleteIndex = null;
        },

        validarCampos() {
            const camposObligatorios = [
                { campo: 'numero_partida', mensaje: 'Número de partida' },
                { campo: 'numero_de_factura', mensaje: 'Número de factura' }, // Cambiado aquí
                { campo: 'descripcion', mensaje: 'Descripción del artículo' },
                { campo: 'precio_unitario', mensaje: 'Importe sin IVA' },
                { campo: 'iva', mensaje: 'IVA' },
                { campo: 'importe_con_iva', mensaje: 'Importe con IVA' },
                { campo: 'cantidad', mensaje: 'Cantidad' },
                { campo: 'unidad_medida', mensaje: 'Unidad de medida' },
                { campo: 'total_ingreso', mensaje: 'Total de ingreso' }
            ];

            for (const { campo, mensaje } of camposObligatorios) {
                if (!this.form[campo]) {
                    this.showAlert(`Por favor, completa el campo: ${mensaje}`, "error");
                    return false;
                }
            }
            return true;
        },


     
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
        async loadObjetosGasto() {
            try {
                const response = await api.get('/objetoGastos');
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
        async loadFacturas() {
            try {
                const response = await api.get('/facturas');
                this.facturas = response.data.map(factura => {
                    if (!factura.numero_de_factura) {
                        console.warn('Factura sin número de factura:', factura);
                    }
                    return factura;
                });
                console.log('Facturas cargadas:', this.facturas); // Verificar datos
            } catch (error) {
                console.error('Error al cargar las facturas:', error);
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
        validarNumeroFactura() {
            // 1. Obtener y limpiar el valor
            const numeroFactura = this.form.numero_de_factura.toString().trim();

            // 2. Si está vacío
            if (!numeroFactura) {
                this.errorNumeroFactura = "El número de factura es obligatorio";
                this.numeroFacturaValido = false;
                this.facturaBloqueada = null; // Asegurar que no quede bloqueada
                return false;
            }

            // 3. Buscar coincidencia exacta en facturas
            const facturaExistente = this.facturas.find(f =>
                f.numero_de_factura.toString() === numeroFactura
            );

            // 4. Si no existe la factura
            if (!facturaExistente) {
                this.errorNumeroFactura = "No existe factura con este número";
                this.numeroFacturaValido = false;
                this.facturaBloqueada = null;
                this.form.id_factura = "";
                return false;
            }

            // 5. Si la factura ya está registrada completamente
            if (facturaExistente.registrada_completa) {
                this.errorNumeroFactura = "Esta factura ya fue registrada completamente";
                this.numeroFacturaValido = false;
                this.facturaBloqueada = null;
                return false;
            }

            // 6. Si es válida y es el primer artículo
            if (this.articulosTabla.length === 0) {
                this.facturaBloqueada = numeroFactura;
            }

            // 7. Asignar valores correctos
            this.form.id_factura = facturaExistente.id;
            this.errorNumeroFactura = "";
            this.numeroFacturaValido = true;

            return true;
        },
        buscarFacturasParciales(valor) {
            return this.facturas.filter(f =>
                f.numero_de_factura.toString().includes(valor) &&
                !f.registrada_completa
            );
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
            this.cerrarModal();
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

tfoot {
    position: sticky;
    bottom: 0;
    background-color: #f8f9fa;
}

.total-row {
    border-top: 2px solid #691B31;
}

.total-row td {
    padding: 12px 15px;
    font-size: 15px;
}

.text-right {
    text-align: right;
}

/* Estilo para mantener visible el footer al hacer scroll */
.table-wrapper {
    max-height: 400px;
    overflow-y: auto;
    position: relative;
}


/* Estilos del modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal-content-delete {
    font-size: 25px;
    background: #691B31;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    text-align: center;
    padding-bottom: 40px;
}

.modal-buttons {
    margin-top: 20px;
}

.btn-confirm,
.btn-cancel {
    padding: 10px;
    margin: 5px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.btn-confirm {
    background-color: green;
    color: white;
}

.btn-cancel {
    background-color: red;
    color: white;
}


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

/* Estilos para la tabla */
.action-btn {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin: 0 2px;
}

.action-btn.delete {
    background-color: #ff4444;
    color: white;
}

.action-btn.delete:hover {
    background-color: #cc0000;
}

.table-actions {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    text-align: right;
}

.register-btn {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

.register-btn:hover {
    background-color: #218838;
}

.register-btn:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

/* Estilos para notificaciones */
.vue-notification {
    margin: 5px;
    padding: 10px;
    font-size: 14px;
    color: #ffffff;
    border-radius: 5px;
}

.vue-notification.success {
    background-color: #28a745;
}

.vue-notification.error {
    background-color: #dc3545;
}

/* Filas con 3 campos */
.form-row.triple {
    justify-content: space-between;
}

.form-row.triple .form-field {
    flex: 1;
    min-width: 0;
    /* Permite que los campos se reduzcan */
    margin-right: 10px;
}

.form-row.triple .form-field:last-child {
    margin-right: 0;
}

/* Contenedor principal centrado */
.content-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;
    height: calc(100% - 160px);
    /* Ajusta según la altura de tus barras de navegación */
    overflow-y: auto;
}

/* Contenedor para formulario y tabla */
.form-table-container {
    display: flex;
    gap: 20px;
    max-width: 1400px;
    /* Ancho máximo del contenedor */
    width: 100%;
    margin: 0 auto;
}

/* Secciones (formulario y tabla) */
.form-section,
.table-section {
    flex: 1;
    min-width: 0;
    /* Permite que se reduzcan equitativamente */
}

/* Estilo del formulario */
.form-section form {
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    height: 530px;
    box-sizing: border-box;
}

/* Estilo de la tabla */
.table-section {
    background: white;
    color: #691B31;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 530px;
    box-sizing: border-box;
}

.table-section h2 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 18px;
    text-align: center;
    color: #691B31;
}

.table-wrapper {
    flex-grow: 1;
    overflow-y: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #691B31;
    color: white;
    position: sticky;
    top: 0;
}

tr:hover {
    background-color: #f5f5f5;
}

/* Ajustes responsive */
@media (max-width: 1200px) {
    .form-table-container {
        flex-direction: column;
        max-width: 800px;
    }

    .form-section,
    .table-section {
        width: 100%;
    }
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



.form-row {
    display: flex;
    justify-content: center;
    margin-bottom: 1px;
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
    min-width: 150px;
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