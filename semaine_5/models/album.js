const sequelize = require("../database/sequelize");
const { DataTypes } = require('sequelize');

module.exports = sequelize.define('album',{
    id: {
        field: 'AlbumId',
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        field: 'Title',
        type: DataTypes.STRING
    }
},{
    tableName: "Album",
    timestamps: false
});