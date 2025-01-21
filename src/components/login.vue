<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo">
      </div>
      <img src="../assets/logoSistema.png" alt="">
      <h2>Inicia Sesión</h2>
      <p>Sistema Inventario y Almacén de Radio y Televisión de Hidalgo</p>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="usuario">Usuario</label>
          <input type="text" id="usuario" v-model="usuario" required />
        </div>
        <div class="input-group">
          <label for="contrasena">Contraseña</label>
          <input type="password" id="contrasena" v-model="contrasena" required />
        </div>
        <button type="submit" class="login-button">Siguiente</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      usuario: '',
      contrasena: ''
    };
  },
  methods: {
    login() {
      if (this.usuario && this.contrasena) {
       

        // Redirigir a otra vista
        this.$router.push('/home'); // Cambia '/dashboard' por la ruta de tu vista destino
      } else {
        alert('Por favor, complete todos los campos.');
      }
    }
  }
};
</script>
<style scoped>
/* Aplicar Montserrat a todo el contenido */
* {
  font-family: 'Montserrat', sans-serif;
}

/* Asegurar que el body y html ocupen toda la pantalla */
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 99vw;
  /* Asegura que ocupe todo el ancho de la ventana */
  height: 97.7vh;
  /* Asegura que ocupe todo el alto de la ventana */
  background: url('../assets/radio-y-television-de-hidalgo.jpg') no-repeat center center;
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
  border-radius: 5px;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background: #8b0000;
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
