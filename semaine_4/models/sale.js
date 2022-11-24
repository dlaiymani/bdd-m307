// models/sale.js
const sequelize = require("../database/db");
const { DataTypes } = require('sequelize');

const Sale = sequelize.define('sale',{
    saleno: {
        field: 'saleno',
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    saledate: {
        field: 'saledate',
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    saletext: {
        field: 'saletext',
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Sale;