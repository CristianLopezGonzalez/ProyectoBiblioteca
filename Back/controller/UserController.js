import { UserModel } from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async getAll(req, res) {
    try {
      const user = await UserModel.getAll();
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.getById({ id });

      if (!user) {
        return res.status(404).json({ error: "No se a encontrado al usuario" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: "Todos los campos son requeridos" });
      }

      // Verificar si el email ya existe
      const existingUser = await UserModel.getByEmail({email});
      if (existingUser) {
        return res.status(409).json({ 
          error: "El email ya está registrado" 
        });
      }

      const rounds = 10;
      const hashPassword = await bcrypt.hash(password, rounds);

      const result = await UserModel.create({
        username,
        email,
        password: hashPassword,
      });

      // Generar JWT
      const token = jwt.sign(
        {
          id: result.insertId,
          email: email,
          username: username,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.status(201).json({
        success: true,
        message: "Usuario registrado exitosamente",
        token,
        user: {
          id: result.insertId,
          username,
          email
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(404).json({ error: "El campo id es obligatorio" });
      }

      const result = await UserModel.delete({ id });

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      res.json({
        success: true,
        message: "Usuario eliminado exitosamente",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { username, email, password } = req.body;

      if (!id) {
        return res.status(404).json({ error: "La id es requerida" });
      }

      if (!username || !email || !password) {
        return res
          .status(404)
          .json({ error: "Los parametros del usuario son requeridos" });
      }

      
      const rounds = 10;
      const hashPassword = await bcrypt.hash(password, rounds);

      const result = await UserModel.update({ 
        id, 
        username, 
        email, 
        password: hashPassword 
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }
      res.json({
        success: true,
        message: "Usuario actualizado con exito",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "Los campos no pueden estar en blanco",
        });
      }

      const user = await UserModel.getByEmail({email});

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Email o contraseña incorrectos",
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Email o contraseña incorrectos",
        });
      }

      // Generar JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.json({
        success: true,
        message: "Login exitoso",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}