const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3001, // Cambia este número por el puerto que necesites
    host: '0.0.0.0' // Permite acceso desde otras IPs en la red
  },
  // Para producción (opcional)
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/'
})