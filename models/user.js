'use strict';

var bcrypt = require('bcrypt'),
    q = require('q');

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
            associate: function (models) {
                User
                    .hasOne(models.Teacher.belongsTo(User))
                    .hasOne(models.Parent.belongsTo(User))
                    .hasOne(models.Student.belongsTo(User))
                    .hasOne(models.Preceptor.belongsTo(User));
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
            },
            /**
             * Associates a user to a classroom if acceptable
             * @param classroom
             */
            associateClassroom: function (classroom) {
                if (this.isPreceptor()) {
                    return this.getPreceptor().then(function (preceptor) {
                        return preceptor.associateClassroom(classroom);
                    });
                } else if (this.isStudent()) {
                    return this.getStudent().then(function (student) {
                        return student.associateClassroom(classroom);
                    });
                } else {
                    return q.defer().resolve(classroom);
                }
            },
            /**
             * Associates a user to a subject if acceptable
             * @param subject
             */
            associateSubject: function (subject) {
                if (this.isTeacher()) {
                    return this.getTeacher().then(function (teacher) {
                        return teacher.associateSubject(subject);
                    });
                } else {
                    return q.defer().resolve(subject);
                }
            }
        }
    });

    return User;
};
