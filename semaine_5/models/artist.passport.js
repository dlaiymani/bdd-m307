const sequelize = require("../database/sequelize");
const { DataTypes } = require('sequelize');

module.exports = sequelize.define('passport',{
    id: {
        field: 'PassportId',
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1
    },
    code: {
        field: 'Code',
        type: DataTypes.STRING
    },
    issueDate: {
        field: 'IssueDate',
        type: DataTypes.DATEONLY
    },
    expiryDate: {
        field: 'ExpiryDate',
        type: DataTypes.DATEONLY
    }
},{
    timestamps: false
});