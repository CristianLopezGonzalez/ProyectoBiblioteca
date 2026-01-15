import mysql from 'mysql2/promise';
import config from './config.js';

const pool = mysql.createPool(config);

export class UserModel {
    static async getById (id){
        cosnt [rows] = await pool.query("SELECT * FROM users WHERE id = ?",[id]);
        return rows[0];
    }

    static async create ({username,email,password}){
        const [result] = await pool.query("INSERT INTO users(username,email,password) VALUES(?,?,?)",[username,email,password]);
        return result;
    }

    static async delete ({id}){
        const [result] = await pool.query("DELETE FROM users WHERE id = ?",[id]);
        return result.affectedRows > 0;
    }

    static async update ({id,username,email,password}){
        const [result] = await pool.query("UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?",[id,username,email,password])
        return result.affectedRows > 0;
    }
}