'use strict';

var bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            set: function (value) {
                return this.setDataValue('password', bcrypt.hashSync(value, 8));
            }
        },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        kind: DataTypes.ENUM('teacher', 'preceptor', 'parent', 'student')
    }, {
        instanceMethods: {
            /**
             * Returns the user's full name
             * @returns {string}
             */
            getFullName: function () {
                return this.first_name + ' ' + this.last_name;
            },
            /**
             * Returns true if entered password matches user's password
             * @param enteredPassword {string}
             * @returns {boolean}
             */
            passwordMatches: function (enteredPassword) {
                return bcrypt.compareSync(enteredPassword, this.password);
            }
        }
    });

    return User;
};