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
                var deferred = q.defer();

                if (this.isPreceptor()) {
                    this.getPreceptor()
                        .complete(function (err, preceptor) {
                            if (err) {
                                return deferred.reject(err);
                            }
                            preceptor.associateClassroom(classroom).then(function (classroom) {
                                deferred.resolve(classroom);
                            });
                        });
                } else if (this.isStudent()) {
                    this.getStudent()
                        .complete(function (err, student) {
                            if (err) {
                                return deferred.reject(err);
                            }
                            student.associateClassroom(classroom).then(function (classroom) {
                                deferred.resolve(classroom);
                            });
                        });
                } else {
                    deferred.resolve(classroom);
                }

                return deferred.promise;
            },
            /**
             * Associates a user to a subject if acceptable
             * @param subject
             */
            associateSubject: function (subject) {
                var deferred = q.defer();

                if (this.isTeacher()) {
                    this.getTeacher()
                        .complete(function (err, teacher) {
                            if (err) {
                                return deferred.reject(err);
                            }
                            teacher.associateSubject(subject).then(function (subject) {
                                deferred.resolve(subject);
                            });
                        });
                }

                return deferred.promise;
            }
        }
    });

    return User;
};
