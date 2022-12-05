const { Sequelize } = require('sequelize');
// modify the credentials
module.exports = new Sequelize("db",
    "user",
    "pass", {
        host: "localhost",
        dialect: 'postgres',
        port: 5432
    });

