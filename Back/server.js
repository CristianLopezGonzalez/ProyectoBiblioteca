import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


//import de las rutas
import userRoutes from './routes/UserRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

//rutas
app.use("/api/users",userRoutes);

//pagina princiapal
app.get('/', (req, res) => {

    res.json({ 
        message: 'API de Biblioteca',
        endpoints: {
            users: '/api/users'
        }
    });
});

// Manejo de error 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Server en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));