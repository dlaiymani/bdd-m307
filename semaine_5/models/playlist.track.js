const sequelize = require("../database/sequelize");
const { DataTypes } = require('sequelize');

module.exports = sequelize.define('playlist_track',
    {},{
    tableName: "PlaylistTrack",
    timestamps: false
});