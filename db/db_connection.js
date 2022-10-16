
const dotenv = require('dotenv')
dotenv.config();
const mysql = require('mysql2');
class DBConnection {

    constructor() {
        // this.db = new Pool({
        //     host: process.env.DATABASE_HOST,
        //     user: process.env.DATABASE_USER,
        //     password: process.env.DATABASE_PASS,
        //     database: process.env.DATABASE_NAME,
        //     port: process.env.DATABASE_PORT,
        // })

        this.db = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
        });



        this.checkConnection();
    }

    checkConnection() {
        this.db.getConnection((err, connection) => {
            if (err) {
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    console.error('Database connection was closed.');
                }
                if (err.code === 'ER_CON_COUNT_ERROR') {
                    console.error('Database has too many connections.');
                }
                if (err.code === 'ECONNREFUSED') {
                    console.error('Database connection was refused.');
                }
            }

            if (connection) {
                connection.release();
            }

            return;
        });
    }

    query = async (sql, values) => {
        return new Promise((resolve, reject) => {
            const callback = (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            }

            // execute the query with internal prepare
            this.db.execute(sql, values, callback);

        }).catch(err => {
            const mysqlErrors = Object.keys(HttpStatusCodes);
            err.status = mysqlErrors.includes(err.code) ? HttpStatusCodes[err.code] : err.status;

            throw err;
        })
    }

}

const HttpStatusCodes = Object.freeze({
    ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: 422,
    ER_DUP_ENTRY: 409
});


module.exports = new DBConnection().query;