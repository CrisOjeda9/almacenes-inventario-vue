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
                <h1>Salida de materiales</h1>
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
                            <label for="area">Área</label>
                            <select v-model="area" required>
                                <option value="" disabled>Seleccione un área</option>
                                <option v-for="area in areas" :key="area" :value="area">
                                    {{ formatArea(area) }}
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
        <!-- Modal para capturar nombres y cargos -->
        <div v-if="showSignatureModal" class="modal2">
            <div class="modal-content2" style="background-color: white; color: #691b31; width: 50%; max-width: 500px;">
                <h2>Información de Firmantes</h2>

                <div class="form-field2">
                    <label for="solicitanteNombre">Nombre del Solicitante:</label>
                    <input type="text" v-model="solicitanteNombre" required />
                </div>

                <div class="form-field2">
                    <label for="solicitanteCargo">Cargo del Solicitante:</label>
                    <input type="text" v-model="solicitanteCargo" required />
                </div>

                <div class="form-field2">
                    <label for="receptorNombre">Nombre del Receptor:</label>
                    <input type="text" v-model="receptorNombre" required />
                </div>

                <div class="form-field2">
                    <label for="receptorCargo">Cargo del Receptor:</label>
                    <input type="text" v-model="receptorCargo" required />
                </div>

                <div class="button-group" style="margin-top: 20px;">
                    <button @click="confirmAndGeneratePDF" class="boton">
                        <i class="fas fa-file-pdf"></i> Generar PDF
                    </button>
                    <button @click="showSignatureModal = false" class="boton-cancelar">
                        Cancelar
                    </button>
                </div>
            </div>
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
            area: "",
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
            areas: [
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
            showConfirmationModal: false,
            showSignatureModal: false,
            solicitanteNombre: '',
            solicitanteCargo: '',
            receptorNombre: '',
            receptorCargo: '',
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
        async generarPDFSolicitud() {
            try {
                // 1. Cargar dinámicamente las dependencias
                const { jsPDF } = await import('jspdf');
                await import('jspdf-autotable');

                // 2. Crear documento con configuración segura
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                // 3. Configuración de márgenes y dimensiones
                const pageWidth = doc.internal.pageSize.getWidth();
                const centerX = pageWidth / 2;
                const margin = 15;
                const tableStartY = 40;

                // 4. Encabezado del documento
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(14);
                doc.text(`VALE DE SALIDA N° ${this.numeroSolicitud}`, centerX, 20, { align: 'center' });

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);

                // Dirección y Área
                doc.text(`Dirección Solicitante: ${this.formatDireccion(this.direccionSolicitante)}`, centerX, 30, { align: 'center' });
                doc.text(`Área: ${this.formatArea(this.area).toUpperCase()}`, centerX, 35, { align: 'center' });  // Área en mayúsculas

                // Fecha en mayúsculas
                const fechaFormateada = this.fechaFormateada.toUpperCase();
                doc.text(`FECHA: ${fechaFormateada}`, centerX, 40, { align: 'center' });  // Posición ajustada a 40
                // Espacio de separación antes de la tabla (15mm)
                // 5. Configuración de la tabla
                const headers = [
                    { title: 'N° Partida', dataKey: 'partida' },
                    { title: 'Unidad', dataKey: 'unidad' },
                    { title: 'Descripción', dataKey: 'descripcion' },
                    { title: 'Cantidad', dataKey: 'cantidad' }
                ];

                const body = this.items.map(item => ({
                    partida: item.numeroPartida || '',
                    unidad: item.unidadMedida || '',
                    descripcion: item.descripcionMaterial || '',
                    cantidad: item.cantidadEntregada || ''
                }));

                // 6. Generar tabla con autotable
                doc.autoTable({
                    head: [headers.map(h => h.title)],
                    body: body.map(item => headers.map(h => item[h.dataKey])),
                    startY: tableStartY + 10,  // Posición ajustada
                    margin: { left: margin, right: margin },
                    headStyles: {
                        fillColor: [188, 149, 91],
                        textColor: [255, 255, 255],
                        fontStyle: 'bold'
                    },
                    columnStyles: {
                        0: { cellWidth: 20, halign: 'center' },
                        1: { cellWidth: 20, halign: 'center' },
                        2: { cellWidth: 'auto', halign: 'left' },
                        3: { cellWidth: 20, halign: 'center' }
                    },
                    styles: {
                        fontSize: 9,
                        cellPadding: 3,
                        overflow: 'linebreak'
                    },
                    didDrawPage: (data) => {
                        // Numeración de páginas
                        const pageCount = doc.internal.getNumberOfPages();
                        doc.setFontSize(8);
                        doc.text(`Página ${data.pageNumber} de ${pageCount}`, centerX, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
                    }
                });

                // 7. Sección de firmas (en la misma página si hay espacio)
                const finalY = doc.lastAutoTable.finalY || tableStartY;
                const spaceNeeded = 60;
                const pageHeight = doc.internal.pageSize.getHeight();

                if (finalY + spaceNeeded > pageHeight) {
                    doc.addPage();
                    doc.setFontSize(12);
                    this.dibujarFirmas(doc, 40);
                } else {
                    doc.setFontSize(12);
                    this.dibujarFirmas(doc, finalY + 25);
                }

                // 8. Guardar el documento
                doc.save(`Vale_Salida_${this.numeroSolicitud}.pdf`);

            } catch (error) {
                console.error('Error al generar PDF:', error);
                this.showAlert("Error al generar el PDF: " + error.message, "error");
            }
        },

        // Método auxiliar para dibujar firmas con formato mejorado
        dibujarFirmas(doc, startY) {
            const centerX = doc.internal.pageSize.getWidth() / 2;
            const signatureWidth = 80;
            const verticalSpacing = 50;
            const columnSpacing = 15;

            // Primera fila de firmas
            const firstLineY = startY + 25;

            // Firma 1 (Izquierda) - Entrega
            this.dibujarFirmaCompleta(
                doc,
                centerX - signatureWidth - columnSpacing,
                firstLineY,
                signatureWidth,
                'SOLICITA',
                this.solicitanteNombre.toUpperCase(),
                this.solicitanteCargo.toUpperCase(),
                30
            );

            // Firma 2 (Derecha) - Validación
            this.dibujarFirmaCompleta(
                doc,
                centerX + columnSpacing,
                firstLineY,
                signatureWidth,
                'AUTORIZA',
                'L.C. EDGAR DE JESUS VERGARA CONTRERAS',
                'DIRECTOR DE COORDINACIÓN FINANCIERA Y PLANEACIÓN',
                30
            );

            // Segunda fila de firmas
            const secondLineY = firstLineY + verticalSpacing;

            // Firma 3 (Izquierda) - Revisión
            this.dibujarFirmaCompleta(
                doc,
                centerX - signatureWidth - columnSpacing,
                secondLineY,
                signatureWidth,
                'RECIBE',
                this.receptorNombre.toUpperCase(),
                this.receptorCargo.toUpperCase(),
                30
            );

            // Firma 4 (Derecha) - Recibe
            this.dibujarFirmaCompleta(
                doc,
                centerX + columnSpacing,
                secondLineY,
                signatureWidth,
                'ENTREGA',
                'IVÁN MARTÍNEZ ALDANA',
                'RESPONSABLE DEL ALMACÉN',
                30
            );
        },

        // Método para dibujar firma completa con formato específico
        dibujarFirmaCompleta(doc, x, y, width, titulo, nombre, cargo, espacioTituloLinea = 12) {
            // Configuración de posiciones
            const titleOffset = 5;
            const lineYOffset = y + espacioTituloLinea;
            const nameOffset = 5;
            const cargoOffset = 10;

            // 1. Título en negrita
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            const titleWidth = doc.getStringUnitWidth(titulo) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            doc.text(titulo, x + (width / 2) - (titleWidth / 2), y + titleOffset);

            // 2. Línea de firma DELGADA
            doc.setDrawColor(0);  // Color negro
            doc.setLineWidth(0.2);  // Línea más delgada (valor original: 0.5)
            doc.line(x, lineYOffset, x + width, lineYOffset);

            // 3. Nombre en negrita
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            const nombreWidth = doc.getStringUnitWidth(nombre) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            doc.text(nombre, x + (width / 2) - (nombreWidth / 2), lineYOffset + nameOffset);

            // 4. Cargo en normal (sin negrita)
            doc.setFont('helvetica', 'normal');
            const cargoWidth = doc.getStringUnitWidth(cargo) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            doc.text(cargo, x + (width / 2) - (cargoWidth / 2), lineYOffset + cargoOffset);
        },

        async obtenerNumeroSolicitud() {
            try {
                // 1. Obtener todas las solicitudes existentes
                const response = await axios.get('http://localhost:3000/api/solicitudes');
                const solicitudes = response.data;

                // 2. Extraer todos los números de solicitud
                const numerosSolicitud = solicitudes.map(s => s.numero_solicitud);

                // 3. Encontrar el número máximo
                const maxNumber = numerosSolicitud.length > 0 ?
                    Math.max(...numerosSolicitud.map(num => parseInt(num))) :
                    0;

                // 4. Calcular el siguiente número (máximo + 1)
                const nextNumber = maxNumber + 1;

                // 5. Formatear a 4 dígitos con ceros a la izquierda
                this.numeroSolicitud = String(nextNumber).padStart(4, '0');

            } catch (error) {
                console.error('Error al obtener número de solicitud:', error);
                // Valor por defecto si hay error
                this.numeroSolicitud = '0001';
                this.showAlert("Error al obtener el número de solicitud. Usando valor temporal.", "error");
            }
        },

        formatSolicitudNumber(num) {
            return String(num).padStart(4, '0');
        },

        async submitForm() {
            // Verificar duplicados
            const uniqueIds = new Set();
            for (const item of this.items) {
                if (uniqueIds.has(item.id_articulo)) {
                    this.showAlert(`El artículo ${item.descripcionMaterial} está duplicado en la solicitud`, "error");
                    return;
                }
                uniqueIds.add(item.id_articulo);
            }

            // Validar cantidades
            for (const item of this.items) {
                if (item.cantidadEntregada > item.cantidadDisponible) {
                    this.showAlert(`No hay suficiente stock para ${item.descripcionMaterial}. Disponible: ${item.cantidadDisponible}`, "error");
                    return;
                }
            }

            // Solo mostrar el modal de firmas
            this.showSignatureModal = true;
        },
        async confirmAndGeneratePDF() {
            if (!this.solicitanteNombre || !this.solicitanteCargo || !this.receptorNombre || !this.receptorCargo) {
                this.showAlert("Por favor complete todos los campos de nombre y cargo", "error");
                return;
            }

            try {
                // Verificar que el número de solicitud no se haya usado
                const checkResponse = await axios.get('http://localhost:3000/api/solicitudes');
                const existeNumero = checkResponse.data.some(s => s.numero_solicitud === this.numeroSolicitud);

                if (existeNumero) {
                    await this.obtenerNumeroSolicitud();
                    this.showAlert("El número de solicitud ya estaba en uso. Se ha generado uno nuevo.", "warning");
                    return;
                }

                // Crear las solicitudes
                const solicitudes = this.items.map(item => ({
                    numero_solicitud: this.numeroSolicitud,
                    direccion_solicitante: this.direccionSolicitante,
                    area: this.area,
                    id_articulo: item.id_articulo,
                    cantidad_entregada: item.cantidadEntregada
                }));

                // Actualizar inventario y crear solicitudes
                const updatePromises = this.items.map(item =>
                    axios.put(`http://localhost:3000/api/articulos/${item.id_articulo}`, {
                        cantidad: item.cantidadDisponible - item.cantidadEntregada
                    })
                );

                const solicitudPromises = solicitudes.map(solicitud =>
                    axios.post('http://localhost:3000/api/solicitudes', solicitud)
                );

                // Ejecutar todas las promesas
                await Promise.all([...updatePromises, ...solicitudPromises]);

                // Generar PDF
                await this.generarPDFSolicitud();

                // Actualizar datos locales
                await this.cargarArticulos();
                await this.obtenerNumeroSolicitud();

                // Mostrar confirmación y cerrar modales
                this.showConfirmationModal = true;
                this.showSignatureModal = false;

            } catch (error) {
                console.error('Error al registrar salida:', error);
                this.showAlert("Ocurrió un error al registrar la salida. Por favor intente nuevamente.", "error");
            }
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
                // Verificar si el artículo ya está en otra fila
                const isDuplicate = this.items.some((item, i) =>
                    i !== index && item.id_articulo === selectedMaterial.id
                );

                if (isDuplicate) {
                    this.showAlert("Este artículo ya ha sido agregado a la solicitud", "error");
                    // Resetear la selección
                    this.items[index].descripcionMaterial = '';
                    this.items[index].unidadMedida = '';
                    this.items[index].numeroPartida = '';
                    this.items[index].id_articulo = null;
                    this.items[index].cantidadDisponible = 0;
                    this.items[index].cantidadEntregada = '';
                    return;
                }

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
        formatArea(area) {
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
            return formatMap[area] || area;
        },



        isCurrentRowComplete(index) {
            const item = this.items[index];
            return item.numeroPartida && item.unidadMedida &&
                item.descripcionMaterial && item.cantidadEntregada;
        },

        addItem() {
            const lastItem = this.items[this.items.length - 1];

            // Verificar si el último artículo ya está en otra fila
            if (lastItem.id_articulo) {
                const isDuplicate = this.items.some((item, i) =>
                    i !== this.items.length - 1 && item.id_articulo === lastItem.id_articulo
                );

                if (isDuplicate) {
                    this.showAlert("Este artículo ya ha sido agregado a la solicitud", "error");
                    return;
                }
            }

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

.modal2 {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content2 {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.form-field2 {
    margin-bottom: 15px;
    width: 90%;
    margin-right: 5%;
    margin-left: 5%;
}

.form-field2 label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-field2 input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.button-group {
    display: flex;
    justify-content: space-between;
}



.boton-cancelar:hover {
    background-color: #d32f2f;
}

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
