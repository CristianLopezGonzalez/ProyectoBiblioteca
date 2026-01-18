import { BooksModel } from "../models/Books";

export class BooksController{
    /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
    static async getAll(req,res){
        try {
            
            const {isbn,autor,titulo} = req.params;

            const books = await BooksModel.getAll({isbn,autor,titulo,genero});
            res.json(books);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
    static async getByIsbn(req,res){
        try {

            const {isbn} = req.params;

            const isbnFormater = isbn.replaceAll("-","");

            if (!isbnFormater) {
                return res.status(400).json({error:"El campo isbn es obligatorio"})
            }

            if (isbnFormater.length > 13) {
                return res.status(400).json({error:"El campo isbn no puede tener mas de 13 caracteres"})
            }

            const book = await BooksModel.findByIsbn({isbnFormater});

            if (!book) {
                return res.status(404).json({error:"No se a encontrado ningun libro con ese isbn"});
            }

            res.json({
                success:true,
                libro:{
                    isbn:book.isbn,
                    titulo:book.titulo,
                    autor:book.autor,
                    ano_publicacion:book.ano_publicacion,
                    genero:book.genero,
                    portada_url:book.portada_url,
                    sinopsis:book.sinopsis
                }
            })
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
    static async createBook(req,res){
        try {
            const {isbn,titulo,autor,anio_publicacion,genero,portada_url,sinopsis} = req.body;

            if (!isbn || !titulo || !autor || !anio_publicacion || !genero || !portada_url || !sinopsis) {
                return res.status(400).json({message:"Todos los campos son oblicatorios"});  
            }

            const existBook = await BooksModel.findByIsbn({isbn});

            if (existBook) {
                return res.status(400).json({message:"Ese libro ya existe"});  
            }

            const result = await BooksModel.create({isbn,titulo,autor,anio_publicacion,genero,portada_url,sinopsis});

            res.status(201).json({
                success: true,
                message: "Libro registrado exitosamente",
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }
}