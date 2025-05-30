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
                <h1>Almacen</h1>
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

            <!-- Mostrar solo si el usuario NO es de Almacén -->
            <a v-if="userRole === 'Administrador'" href="users" class="nav-item">Aministrador</a>

            <!-- Solo mostrar "Almacén" si el usuario tiene el rol de Almacén -->
            <div v-if="userRole === 'Almacenes' || userRole === 'Administrador'" class="nav-item" @mouseenter="showMenu('almacenMenu')"
                @mouseleave="hideMenu('almacenMenu')">
                Almacén
                <span class="menu-icon">▼</span>
                <div class="dropdown-menu" v-show="menus.almacenMenu">
                    <button @click="navigateTo('proveedor')">Ver proveedores</button>
                    <button @click="navigateTo('factura')">Facturas</button>
                    <button @click="navigateTo('existencia')">Entrada de artículos</button>
                    <button @click="navigateTo('solicitudmaterial')">Salida de material</button>
                    <button @click="navigateTo('recepcionsolicitudes')">Recepción de solicitudes</button>
                    <button @click="navigateTo('poliza')">Pólizas</button>
                </div>
            </div>

            <div v-if="userRole === 'Inventario' || userRole === 'Administrador'" class="nav-item" @mouseenter="showMenu('homeMenu')"
                @mouseleave="hideMenu('homeMenu')">
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
        </div>
    </div>    
</template>