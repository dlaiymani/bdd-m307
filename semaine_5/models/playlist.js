const sequelize = require("../database/sequelize");
const { DataTypes } = require('sequelize');

module.exports = sequelize.define('playlist',{
    id: {
        field: 'PlaylistId',
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        field: 'Name',
        type: DataTypes.STRING
    }
},{
    tableName: "Playlist",
    timestamps: false
});