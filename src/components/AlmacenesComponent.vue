// En cualquier componente Vue
import api from '@/services/api';

export default {
  name: 'AlmacenesComponent',
  data() {
    return {
      almacenes: [],
      loading: false,
      error: null
    };
  },
  methods: {
    async obtenerAlmacenes() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.get('/almacenes');
        this.almacenes = response.data;
      } catch (error) {
        this.error = 'Error al cargar almacenes: ' + error.message;
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async crearAlmacen(nuevoAlmacen) {
      try {
        const response = await api.post('/almacenes', nuevoAlmacen);
        this.almacenes.push(response.data);
        return response.data;
      } catch (error) {
        this.error = 'Error al crear almacén: ' + error.message;
        throw error;
      }
    },
    
    async actualizarAlmacen(id, datosActualizados) {
      try {
        const response = await api.put(`/almacenes/${id}`, datosActualizados);
        const index = this.almacenes.findIndex(a => a.id === id);
        if (index !== -1) {
          this.almacenes[index] = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = 'Error al actualizar almacén: ' + error.message;
        throw error;
      }
    },
    
    async eliminarAlmacen(id) {
      try {
        await api.delete(`/almacenes/${id}`);
        this.almacenes = this.almacenes.filter(a => a.id !== id);
      } catch (error) {
        this.error = 'Error al eliminar almacén: ' + error.message;
        throw error;
      }
    }
  },
  
  mounted() {
    this.obtenerAlmacenes();
  }
};