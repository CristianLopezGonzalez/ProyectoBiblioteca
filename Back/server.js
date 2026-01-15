import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/', async (req , res ) => {
    res.send("hola mundo");  
})

// Server en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));