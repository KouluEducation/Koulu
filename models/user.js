'use strict';

var bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            unique: true,
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
        classMethods: {
            associate: function(models) {
                User.hasOne(models.Teacher);
                User.hasOne(models.Parent);
                User.hasOne(models.Student);
                User.hasOne(models.Preceptor);
            }
        },
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
            },
            /**
             * Returns true if the user is a teacher
             * @returns {boolean}
             */
            isTeacher: function () {
                return this.kind === 'teacher';
            },
            /**
             * Returns true if the user is a preceptor
             * @returns {boolean}
             */
            isPreceptor: function () {
                return this.kind === 'preceptor';
            },
            /**
             * Returns true if the user is a parent
             * @returns {boolean}
             */
            isParent: function () {
                return this.kind === 'parent';
            },
            /**
             * Returns true if the user is a student
             * @returns {boolean}
             */
            isStudent: function () {
                return this.kind === 'student';
            }
        }
    });

    return User;
};