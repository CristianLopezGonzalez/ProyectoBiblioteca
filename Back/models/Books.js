import mysql from 'mysql2/promise';
import config from './config.js';

const pool = mysql.createPool(config);

export class BooksModel {

    static async getAll({ isbn, autor, titulo, genero }) {
    let query = "SELECT * FROM books WHERE 1=1";
    const params = [];
    
    if (isbn) {
        query += " AND isbn LIKE ?";
        params.push(`%${isbn}%`);
    }
    if (autor) {
        query += " AND autor LIKE ?";
        params.push(`%${autor}%`);
    }
    if (titulo) {
        query += " AND titulo LIKE ?";
        params.push(`%${titulo}%`);
    }
    if (genero) {
        query += " AND genero LIKE ?";
        params.push(`%${genero}%`);
    }
    
    const [result] = await pool.query(query, params);
    return result;
}

    static async findByIsbn ({isbn}){
        const [row] = await pool.query("SELECT * FROM books WHERE isbn = ?",[isbn]);
        return row[0];
    }

    static async create ({isbn,titulo,autor,anio_publicacion,genero,portada_url,sinopsis}){
        const [result] = await pool.query("INSERT INTO books(isbn,titulo,autor,ano_publicacion,genero,portada_url,sinopsis) VALUES(?,?,?,?,?,?,?)",[isbn,titulo,autor,anio_publicacion,genero,portada_url,sinopsis]);
        return result;
    }

    static async update ({isbn,titulo,autor,anio_publicacion,genero,portada_url,sinopsis}){
        const [result] = await pool.query("UPDATE books SET titulo = ?, autor = ?, ano_publicacion = ?, genero = ?, portada_url = ?, sinopsis = ? WHERE isbn = ?",[titulo,autor,anio_publicacion,genero,portada_url,sinopsis,isbn])
        return result.affectedRows > 0;
    }

    static async delete ({isbn}){
        const [result] = await pool.query("DELETE FROM books WHERE isbn = ?",[isbn]);
        return result.affectedRows > 0;
    }

}