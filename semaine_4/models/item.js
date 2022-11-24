const sequelize = require("../database/db");
const { DataTypes } = require('sequelize');

const Item = sequelize.define('item',{
    itemno: {
        field: 'itemno',
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    itemname: {
        field: 'itemname',
        type: DataTypes.STRING,
        allowNull: false
    },
    itemtype: {
        field: 'itemtype',
        type: DataTypes.STRING,
        allowNull: false
    },
    itemcolor: {
        field: 'itemcolor',
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps: false,
    freezeTableName : true
});

module.exports = Item;