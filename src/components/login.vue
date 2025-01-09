<template>
    <div class="login-container">
        <h2>Iniciar Sesión</h2>
        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" v-model="username" placeholder="Ingresa tu username" required />
            </div>
            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" v-model="password" placeholder="Ingresa tu contraseña" required />
            </div>
            <button type="submit">Ingresar</button>
        </form>
        <p v-if="error" class="error-message">{{ error }}</p>
    </div>
</template>

<script>
export default {
    name: "LoginPage",
    props: [],
    data() {
        return {
            username: "",
            password: "",
            error: null,
        };
    },
    methods: {
        handleLogin() {
            if (this.username === "admin" && this.password === "12345") {
                alert("Inicio de sesión exitoso");
                // Aquí puedes redirigir al usuario o realizar otra acción
            } else {
                this.error = "Usuario o contraseña incorrectos";
            }
        },
    },
};
</script>

<style scoped>
.login-container {
    width: 300px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

.error-message {
    color: red;
    text-align: center;
    margin-top: 10px;
}
</style>
