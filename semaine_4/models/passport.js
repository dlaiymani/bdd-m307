const sequelize = require("../database/db");
const { DataTypes } = require('sequelize');

const Passport = sequelize.define('passport', {
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passportNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    issueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    expirationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
});
module.exports = Passport;


