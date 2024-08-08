const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

class DbService {
  static getDbServiceInstance() {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: process.env.DB_PORT,
    });

    this.connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
      }
      console.log('db ' + this.connection.state);
    });
  }

  async getAllData() {
    try {
      const result = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM students;";
        this.connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async insertName(name) {
    try {
      const result = await new Promise((resolve, reject) => {
        const query = "INSERT INTO students (name) VALUES (?);";
        this.connection.query(query, [name], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results.affectedRows > 0);
        });
      });
      return result;
    } catch (error) {
      console.error('Error inserting data:', error);
      throw error;
    }
  }

  async updateNameById(id, name) {
    try {
      const result = await new Promise((resolve, reject) => {
        const query = "UPDATE students SET name = ? WHERE id = ?;";
        this.connection.query(query, [name, id], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results.affectedRows > 0);
        });
      });
      return result;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }

  async deleteRowById(id) {
    try {
      const result = await new Promise((resolve, reject) => {
        const query = "DELETE FROM students WHERE id = ?;";
        this.connection.query(query, [id], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results.affectedRows > 0);
        });
      });
      return result;
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  }

  async searchByName(name) {
    try {
      const result = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM students WHERE name LIKE ?;";
        this.connection.query(query, [`%${name}%`], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return result;
    } catch (error) {
      console.error('Error searching data:', error);
      throw error;
    }
  }
}

module.exports = DbService;
