const sequelize = require("../database/db");
const { DataTypes } = require('sequelize');

const ItemType = sequelize.define('itemType',{
    itemtypeno: {
        field: 'itemtypeno',
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    itemtypename: {
        field: 'itemtypename',
        type: DataTypes.STRING,
        allowNull: false
    },
    itemtypedesc: {
        field: 'itemtypedesc',
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    timestamps: false,
    freezeTableName : true
});

module.exports = ItemType;