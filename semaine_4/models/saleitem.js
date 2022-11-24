const sequelize = require("../database/db");
const { DataTypes } = require('sequelize');
const SaleItem = sequelize.define('saleItem',{
    id: {
        field: 'id',
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: {
        field: 'quantity',
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        field: 'price',
        type: DataTypes.FLOAT,
        allowNull: false
    },
    unitprice: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.price/this.quantity;
        },
        set(unitprice){
            throw new Error('Do not try to set the `unitprice` value!');
        }
    }
},
    {
        freezeTableName: true,
        timestamps: false
    });
module.exports = SaleItem;