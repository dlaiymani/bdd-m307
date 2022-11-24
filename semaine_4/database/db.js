const Sequelize = require("sequelize");

const sequelize = new Sequelize('postgres','josephazar','',{
   dialect: 'postgres',
    port: 5432,
    host: 'localhost'
});

module.exports = sequelize;





