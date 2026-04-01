import mongoose from 'mongoose';

/**
 * Función para conectar la aplicación a la base de datos MongoDB.
 */
const connectDB = async () => {
  try {
    // 127.0.0.1 es el localhost. 
    // "ecommerce" es el nombre de la base de datos que se creará automáticamente.
    const mongoURI = 'mongodb://127.0.0.1:27017/ecommerce';

    await mongoose.connect(mongoURI);

    console.log('MongoDB Conectado exitosamente');
  } catch (error) {
    console.error('Error al intentar conectar a MongoDB:', error);
    
    // Si la base de datos no conecta, la app no debería seguir corriendo
    process.exit(1);
  }
};

export default connectDB;


