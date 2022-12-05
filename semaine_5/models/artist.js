const sequelize = require("../database/sequelize");
const { DataTypes } = require('sequelize');

module.exports = sequelize.define('artist',{
    id: {
        field: 'ArtistId',
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        field: 'Name',
        type: DataTypes.STRING,
        allowNull: false,
        // si la valeur du name est nulle, cela sera ignoré
        validate: {
            // Le nom ne doit pas être vide
            notEmpty: {
                args: true,
                msg: 'Name is required'
            },
            // Le nom ne doit contenir que des lettres
            isAlpha: {
                args: true,
                msg: 'Name must only contain letters'
            },
            // Le nom doit contenir entre 2 et 10 caractères
            len: {
                args: [2, 10],
                msg: 'Name must be between 2 and 10 characters'
            },
            //is: /^[a-e]+$/i
        }
    },
    surname : {
        field: 'Surname',
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            // même si la valeur du nom de famille est nulle,
            // le customValidator sera toujours invoqué
            customValidator(value){
                if(value === null && this.name.length < 3){
                    // Un nom de famille est requis sauf si l'artiste
                    // a un prénom avec plus de deux caractères
                    throw new Error("A surname is required unless the artist" +
                        " has a name with more than two characters");
                }
            },
            //not: /^[a-e]+$/i
        }
    },
    email: {
        field: 'Email',
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true,
            contains: '.fr'
        }
    },
    age: {
        field: 'Age',
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isNumeric: true,
            min: 12,
            max: 80,
            isOdd(value) {
                if (parseInt(value) % 2 === 0) {
                    throw new Error('Only odd values are allowed!');
                }
            },
            notIn: [[25,27,29,31,33]]
        }
    },
    password: {
        field: 'Password',
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notLiteralPassword(value) {
                const forbiddenPasswords = ["password", "123456", "p@ssw0rd", "098765"];
                if (forbiddenPasswords.includes(value)) {
                    throw new Error("Your password cannot be 'password', '123456', 'p@ssw0rd', or '098765'");
                }
            }
        }
    }
},{
    tableName: "Artist",
    timestamps: false,
    validate: {
        namePassMatch(){
            if(this.name === this.password){
                throw new Error("Password cannot be your name!!!");
            }
        }
    }
});

