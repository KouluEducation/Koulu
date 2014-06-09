'use strict';

var q = require('q');

module.exports = function (sequelize, DataTypes) {
    var Student = sequelize.define('Student', {}, {
        classMethods: {
            associate: function (models) {}
        },
        instanceMethods: {
            /**
             * Associates a student to a classroom
             * @param classroom
             */
            associateClassroom: function (classroom) {
                var deferred = q.defer();

                this.setClassroom(classroom)
                    .complete(function (err) {
                        if (err) {
                            return deferred.reject(err);
                        }
                        deferred.resolve(classroom);
                    });

                return deferred.promise;
            }
        }
    });

    return Student;
};
