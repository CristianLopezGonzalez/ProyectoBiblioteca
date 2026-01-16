import express from 'express';
import { UserController } from '../controller/UserController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
const router = express.Router();

// Rutas publicas
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Rutas protegidas
router.get("/", verifyToken, UserController.getAll);
router.get("/:id", verifyToken, UserController.getById);
router.delete("/:id", verifyToken, UserController.delete);
router.put("/:id", verifyToken, UserController.update);

export default router;
