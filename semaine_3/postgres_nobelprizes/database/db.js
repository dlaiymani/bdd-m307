const {Pool} = require("pg");
require('dotenv').config();

// create .env file and put the credentials in it
const credentials = {
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};
const pool =  new Pool(credentials)
module.exports = pool;