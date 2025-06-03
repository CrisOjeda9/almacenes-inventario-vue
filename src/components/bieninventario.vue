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
            <a href="users" class="nav-item">Aministrador</a>
            <div class="nav-item" @mouseenter="showMenu('bieninventarioMenu')"
                @mouseleave="hideMenu('bieninventarioMenu')">
                Almacen
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.bieninventarioMenu">
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('existencia')">Entrada de artículos</button>
                    <button @click="navigateTo('articulos')">Existencias</button>
                    <button @click="navigateTo('solicitudmaterial')">Salida de material</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepción de solicitudes</button>
                    <button @click="navigateTo('poliza')">Pólizas</button>
                </div>
            </div>
            <div class="nav-item" @mouseenter="showMenu('homeMenu')" @mouseleave="hideMenu('homeMenu')">
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
            <div v-if="userRole === 'Usuarios' || userRole === 'Administrador'" class="nav-item" @mouseenter="showMenu('userMenu')"
                @mouseleave="hideMenu('userMenu')">
                Usuario
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.userMenu">
                    <button @click="navigateTo('')">Solicitud de Material</button>
                    <button @click="navigateTo('resguardoUsuario')">Resguardo</button>
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
                        <input type="text" id="inventario" placeholder=""
                            v-model="form.inventario" :disabled="form.tipoInventario === 'gob' ? false : true"
                            @input="handleInput" required />
                    </div>
                    <!-- Descripción -->
                    <div class="form-field"> 
                        <label for="descripcion">Descripción</label> 
                        <input 
                            type="text" 
                            id="descripcion"  
                            placeholder="" 
                            :value="selectedArticuloDescription"
                            readonly
                            required 
                        /> 
                    </div>

                    <!-- Color -->
                    <div class="form-field">
                        <label for="color">Color</label>
                        <input type="text" id="color" placeholder="" v-model="form.color"
                            required />
                    </div>
                </div>

                <div class="form-row">
                    <!-- Material -->
                    <div class="form-field">
                        <label for="material">Material</label>
                        <input type="text" id="material" placeholder="" v-model="form.material"
                            required />
                    </div>
                    <!-- Marca -->
                    <div class="form-field">
                        <label for="marca">Marca</label>
                        <input type="text" id="marca" placeholder="" v-model="form.marca"
                            required />
                    </div>
                    <!-- Modelo -->
                    <div class="form-field">
                        <label for="modelo">Modelo</label>
                        <input type="text" id="modelo" placeholder="" v-model="form.modelo"
                            required />
                    </div>

                    <!-- Serie -->
                    <div class="form-field">
                        <label for="serie">Serie</label>
                        <input type="text" id="serie" placeholder="" v-model="form.serie"
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
import api from '../services/api';
export default {
    name: "BienPage",
    data() {
        return {
            userName: "Cargando...", // Mensaje temporal
            profileImage: "",  // URL de la imagen del usuario
            articulos: [], // Array para almacenar los artículos
            isLoading: false, // Indicador de carga
            form: {
                tipoInventario: "",
                inventario: "",
                id_articulo: "",
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
                userMenu: false,
            },
        };
    },
    computed: {
        selectedArticuloDescription() {
            // Si viene descripción por parámetro, usar esa
            if (this.$route.params.descripcion) {
                return this.form.descripcion;
            }
            
            // Si no, buscar por ID seleccionado
            if (!this.form.id_articulo) return '';
            const articulo = this.articulos.find(art => art.id == this.form.id_articulo);
            return articulo ? articulo.descripcion : '';
        }
    },
    mounted() {
        this.loadUserData();
        this.loadArticulos().then(() => {
            // Prioridad 1: Verificar si hay un ID de artículo desde localStorage (más reciente)
            const articuloIdFromStorage = localStorage.getItem('articuloId');
            
            // Prioridad 2: Verificar si se pasó un ID como parámetro en la URL
            const articuloIdFromParams = this.$route.params.articuloId;
            
            // Prioridad 3: Verificar si se pasó una descripción como parámetro (método anterior)
            const descripcionFromParams = this.$route.params.descripcion;

            if (articuloIdFromStorage) {
                // Usar el ID desde localStorage (más reciente)
                console.log('Usando ID desde localStorage:', articuloIdFromStorage);
                this.setArticuloById(articuloIdFromStorage);
                // Limpiar localStorage después de usar
                localStorage.removeItem('articuloId');
            } else if (articuloIdFromParams) {
                // Usar el ID desde parámetros de URL
                console.log('Usando ID desde parámetros:', articuloIdFromParams);
                this.setArticuloById(articuloIdFromParams);
            } else if (descripcionFromParams) {
                // Método anterior: usar descripción para buscar artículo
                console.log('Usando descripción desde parámetros:', descripcionFromParams);
                this.form.descripcion = descripcionFromParams;
                
                // Buscar y seleccionar automáticamente el artículo correspondiente
                const articulo = this.articulos.find(art => 
                    art.descripcion.toLowerCase() === descripcionFromParams.toLowerCase()
                );
                if (articulo) {
                    this.form.id_articulo = articulo.id;
                }
            }
        });

        // Cargar el último número de inventario al inicializar
        this.loadLastInventoryNumber();
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
        // Nuevo método para cargar el último número de inventario usado
        async loadLastInventoryNumber() {
            try {
                console.log('Consultando último número de inventario...');
                const response = await api.get('/inventario');
                const inventarios = response.data;
                
                if (inventarios && inventarios.length > 0) {
                    // Encontrar el número más alto de inventario
                    const numerosInventario = inventarios
                        .map(item => parseInt(item.numero_inventario))
                        .filter(num => !isNaN(num)); // Filtrar números válidos
                    
                    if (numerosInventario.length > 0) {
                        const maxNumber = Math.max(...numerosInventario);
                        this.inventarioCounter = maxNumber + 1;
                        console.log('Último número encontrado:', maxNumber);
                        console.log('Siguiente número a usar:', this.inventarioCounter);
                    } else {
                        console.log('No se encontraron números válidos, usando valor por defecto:', this.inventarioCounter);
                    }
                } else {
                    console.log('No hay inventarios previos, usando valor por defecto:', this.inventarioCounter);
                }
            } catch (error) {
                console.error('Error al cargar último número de inventario:', error);
                console.log('Usando valor por defecto:', this.inventarioCounter);
            }
        },

        // Método mejorado para generar número único de inventario
        async generateInventoryNumber() {
            try {
                // Obtener todos los números de inventario existentes
                const response = await api.get('/inventario');
                const inventarios = response.data;
                
                // Extraer todos los números de inventario existentes
                const numerosExistentes = inventarios
                    .map(item => parseInt(item.numero_inventario))
                    .filter(num => !isNaN(num));
                
                // Encontrar el siguiente número disponible
                let nuevoNumero = this.inventarioCounter;
                
                // Verificar si el número ya existe y buscar el siguiente disponible
                while (numerosExistentes.includes(nuevoNumero)) {
                    nuevoNumero++;
                }
                
                // Actualizar el contador y asignar el número
                this.inventarioCounter = nuevoNumero;
                this.form.inventario = nuevoNumero.toString().padStart(5, '0');
                
                console.log('Nuevo número de inventario generado:', this.form.inventario);
                
                // Incrementar el contador para la próxima vez
                this.inventarioCounter++;
                
            } catch (error) {
                console.error('Error al generar número de inventario:', error);
                // En caso de error, usar el método anterior como respaldo
                this.form.inventario = this.inventarioCounter.toString().padStart(5, '0');
                this.inventarioCounter++;
            }
        },

        // Nuevo método para establecer el artículo por ID
        setArticuloById(articuloId) {
            console.log('Buscando artículo con ID:', articuloId);
            console.log('Artículos disponibles:', this.articulos);
            
            // Buscar el artículo por ID
            const articulo = this.articulos.find(art => art.id == articuloId);
            
            if (articulo) {
                console.log('Artículo encontrado:', articulo);
                // Establecer el ID y descripción del artículo
                this.form.id_articulo = articulo.id;
                this.form.descripcion = articulo.descripcion;
                
                console.log('Formulario actualizado:', {
                    id_articulo: this.form.id_articulo,
                    descripcion: this.form.descripcion
                });
            } else {
                console.warn('No se encontró ningún artículo con el ID:', articuloId);
                console.log('IDs disponibles:', this.articulos.map(art => art.id));
            }
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
        
        async loadArticulos() {
            this.isLoading = true;
            try {
                const response = await api.get('/articulos');
                console.log('Artículos cargados:', response.data); // Verificar los datos cargados
                
                this.articulos = response.data
                    .map(articulo => ({
                        ...articulo,
                        // Si tienes fotos, puedes procesarlas aquí también
                        foto_articulo: articulo.foto_articulo ? this.extractFileNames(articulo.foto_articulo) : []
                    }))
                    .sort((a, b) => {
                        // Ordenar por descripción alfabéticamente
                        return a.descripcion.localeCompare(b.descripcion);
                    });
                    
                console.log('Artículos procesados:', this.articulos); // Verificar los datos procesados
            } catch (error) {
                console.error('Error al cargar los artículos:', error);
                // Opcional: mostrar mensaje de error al usuario
                alert('Error al cargar los artículos. Por favor, recarga la página.');
            } finally {
                this.isLoading = false; // Desactivar el indicador de carga
            }
        },

        extractFileNames(filePath) {
            // Método para extraer nombres de archivos si es necesario
            if (!filePath) return [];
            
            // Si es un string con múltiples rutas separadas por coma
            if (typeof filePath === 'string') {
                return filePath.split(',').map(path => {
                    return path.trim().split('\\').pop().split('/').pop();
                });
            }
            
            return [];
        },
        
        async handleInput() {
            // Si el tipo de inventario es "gob", dejar al usuario escribir el número.
            // Si no es "gob", evitar que el usuario lo cambie y regenerar si es necesario.
            if (this.form.tipoInventario !== 'gob') {
                await this.generateInventoryNumber();
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

        mapTipoPosesion(tipoPosesion) {
            const mapping = {
                'inventario': 'inventario',
                'comodato': 'Comodato'
            };
            return mapping[tipoPosesion] || tipoPosesion;
        },

        // Método para mapear estado del bien a valores ENUM correctos
        mapEstadoBien(estadoBien) {
            const mapping = {
                'nuevo': 'Nuevo',
                'bueno': 'Bueno', 
                'regular': 'Regular',
                'malo': 'Malo',
                'inservible': 'Inservible'
            };
            return mapping[estadoBien] || estadoBien;
        },

        // Método corregido para registrar bien en inventario
        async registerBien() {
            try {
                console.log("=== REGISTRAR BIEN ===");
                console.log("Datos del formulario:", this.form);

                // Validar que todos los campos requeridos estén completos
                if (!this.validateForm()) {
                    return;
                }

                // Verificar una vez más que el número de inventario sea único
                if (this.form.tipoInventario !== 'gob') {
                    await this.generateInventoryNumber();
                }

                // Obtener el ID del artículo
                const articuloId = this.form.id_articulo || this.getArticuloIdByDescription();
                
                if (!articuloId) {
                    alert('Error: No se pudo identificar el artículo seleccionado');
                    return;
                }

                // Preparar los datos para enviar con valores ENUM correctos
                const inventarioData = {
                    tipo_inventario: this.form.tipoInventario.toUpperCase(),
                    numero_inventario: parseInt(this.form.inventario),
                    id_articulo: parseInt(articuloId),
                    color: this.form.color.trim(),
                    material: this.form.material.trim(),
                    marca: this.form.marca.trim(),
                    modelo: this.form.modelo.trim(),
                    serie: this.form.serie.trim(),
                    tipo_posesion: this.mapTipoPosesion(this.form.tipodeposesion), // Usar mapeo correcto
                    estado_bien: this.mapEstadoBien(this.form.estadobien),  
                };

                console.log("Enviando datos del inventario:", inventarioData);
                console.log("Valores mapeados:", {
                    tipo_posesion: inventarioData.tipo_posesion,
                    estado_bien: inventarioData.estado_bien
                });

                // Enviar la solicitud a la API
                const response = await fetch("http://192.168.10.31:3000/api/inventario", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(inventarioData),
                });

                // Obtener la respuesta
                const responseData = await response.json();
                console.log("Respuesta del servidor:", responseData);

                if (!response.ok) {
                    console.error("Error del servidor:", responseData);
                    throw new Error(responseData.message || `Error ${response.status}: ${response.statusText}`);
                }

                console.log("Bien registrado exitosamente:", responseData);

                // Mostrar mensaje de éxito
                alert("Bien registrado exitosamente en el inventario");

                // Limpiar el formulario
                this.resetForm();

                // Redirigir a la vista de bienes nuevos
                this.$router.push('/existencia');

            } catch (error) {
                console.error("Error completo al registrar el bien:", error);
                alert(`Hubo un error al registrar el bien: ${error.message}`);
            }
        },

        // Método para validar el formulario
        validateForm() {
            const requiredFields = [
                'tipoInventario',
                'inventario', 
                'color',
                'material',
                'marca',
                'modelo',
                'serie',
                'tipodeposesion',
                'estadobien'
            ];

            for (let field of requiredFields) {
                if (!this.form[field] || this.form[field].trim() === '') {
                    alert(`Por favor, completa el campo: ${this.getFieldLabel(field)}`);
                    return false;
                }
            }

            // Validar que haya una descripción seleccionada
            if (!this.selectedArticuloDescription) {
                alert('Por favor, selecciona un artículo válido');
                return false;
            }

            return true;
        },

        // Método para obtener el label del campo en español
        getFieldLabel(fieldName) {
            const labels = {
                'tipoInventario': 'Tipo de Inventario',
                'inventario': 'Número de Inventario',
                'color': 'Color',
                'material': 'Material',
                'marca': 'Marca',
                'modelo': 'Modelo',
                'serie': 'Serie',
                'tipodeposesion': 'Tipo de Posesión',
                'estadobien': 'Estado del Bien'
            };
            return labels[fieldName] || fieldName;
        },

        // Método para obtener el ID del artículo por descripción (respaldo)
        getArticuloIdByDescription() {
            if (!this.selectedArticuloDescription) return null;
            
            const articulo = this.articulos.find(art => 
                art.descripcion.toLowerCase() === this.selectedArticuloDescription.toLowerCase()
            );
            
            return articulo ? articulo.id : null;
        },

        // Método para limpiar el formulario
        resetForm() {
            this.form = {
                tipoInventario: "",
                inventario: "",
                id_articulo: "",
                descripcion: "",
                color: "",
                material: "",
                marca: "",
                modelo: "",
                serie: "",
                tipodeposesion: "",
                estadobien: ""
            };
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
.search-bar {
    margin: 20px 0;
    text-align: center;
    width: auto;

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
.input-wrapper {
    position: relative;
    width: 60%;
    display: inline-block;
}

.input-wrapper input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border-radius: 25px;
    border: 1px solid #BC955B;
    background-color: #fff;
}

.input-wrapper i {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #691B31;
    pointer-events: none;
}

.input-wrapper input::placeholder {
    color: #691B31;
}
</style>