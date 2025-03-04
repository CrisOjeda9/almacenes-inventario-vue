<template>
  <div class="login-container">
    <div class="login-card">
      <img src="../assets/logoSistema.png" alt="Logo">
      <h2>Inicia Sesión</h2>
      <p>Sistema Inventario y Almacén de Radio y Televisión de Hidalgo</p>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="usuario">Email</label>
          <input type="email" id="usuario" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="contrasena">Contraseña</label>
          <input type="password" id="contrasena" v-model="password" required />
        </div>
        <button type="submit" class="login-button">Siguiente</button>
      </form>
    </div>
    <!-- Contenedor de notificaciones -->
    <div v-if="alertMessage" :class="alertClass" class="notification">
      <i :class="alertIcon"></i> {{ alertMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      alertMessage: "",  // Mensaje de la alerta
      alertClass: "",    // Clase de la alerta (ej. 'success' o 'error')
      alertIcon: "",     // Icono para la alerta
      email: '',
      password: '',
      personas: [],      // Lista de personas para obtener el email
      usuarios: []       // Lista de usuarios para obtener la contraseña y relacionar con personas
    };
  },
  methods: {
    async login() {
      try {
        // Obtener las personas y los usuarios de las respectivas APIs
        const [personasResponse, usuariosResponse] = await Promise.all([
          fetch('http://localhost:3000/api/personas'),
          fetch('http://localhost:3000/api/usuarios')
        ]);

        this.personas = await personasResponse.json();
        this.usuarios = await usuariosResponse.json();

        // Buscar la persona que coincida con el email ingresado
        const persona = this.personas.find(p => p.email === this.email);

        if (persona) {
          // Buscar el usuario correspondiente a esa persona usando el id_persona
          const usuario = this.usuarios.find(u => u.id_persona === persona.id);

          if (usuario && usuario.password === this.password) {
            // Guardar en localStorage
            localStorage.setItem('userRole', usuario.rol);
            localStorage.setItem('userName', persona.nombre);
            localStorage.setItem('userEmail', persona.email);

            // Redirigir a home
            this.$router.push('/home');
          } else {
            this.showAlert("Usuario o contraseña incorrectos", "error");
          }
        } else {
          this.showAlert("El correo electrónico no está registrado", "error");
        }
      } catch (error) {
        console.error('Error al conectar con la API', error);
        this.showAlert('Error en el servidor: ' + error.message, 'error');
      }
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
  }
};
</script>

<style>
body {
  margin: 0;
  background: url('../assets/radio-y-television-de-hidalgo.jpg') no-repeat center center;
  background-size: cover;
  /* Asegura que la imagen ocupe toda la pantalla */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
<style scoped>
/* Aplicar Montserrat a todo el contenido */
* {
  font-family: 'Montserrat', sans-serif;
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


.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 99vw;
  /* Asegura que ocupe todo el ancho de la ventana */
  height: 97.7vh;
  /* Asegura que ocupe todo el alto de la ventana */
  background-size: cover;
}

.login-card {
  background: white;
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

img {
  width: 30%;
  margin-bottom: 1rem;
}

h2 {
  font-size: 50px;
  margin: 0.5rem 0;
}

p {
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
  width: 100%;
}

.input-group label {
  display: block;
  font-size: 15px;
  margin-bottom: 0.5rem;
  color: #666;
  text-align: left;
  /* Mantener el texto alineado a la izquierda */
}

.input-group input {
  width: 95%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 25px;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #8b0000;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
}

.login-button:hover {
  background: #a40000;
}
</style>
