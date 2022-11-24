const sequelize = require("../database/db");
const { DataTypes } = require('sequelize');

const Client = sequelize.define('client',{
   id: {
       field: 'clientid',
       type: DataTypes.INTEGER,
       allowNull: false,
       unique: true,
       primaryKey: true
   },
    firstname: {
       field: 'firstName',
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
       field: 'lastName',
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Client;