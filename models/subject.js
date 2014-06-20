'use strict';

var q = require('q');

module.exports = function (sequelize, DataTypes) {
    var Subject = sequelize.define('Subject', {
        name: {
            type: DataTypes.STRING,
            unique: true
        }
    }, {
        classMethods: {
            associate: function (models) {
                Subject
                    .belongsTo(models.Classroom.hasMany(Subject))
                    .hasMany(models.Teacher.hasMany(Subject));
            }
        },
        instanceMethods: {
            /**
             * Associates a classroom to a subject
             * @param classroom
             */
            associateClassroom: function (classroom) {
                var deferred = q.defer();

                this.setClassroom(classroom).complete(function (err) {
                    if (err) {
                        return deferred.reject(err);
                    }
                    deferred.resolve(classroom);
                });

                return deferred.promise;
            }

        }
    });

    return Subject;
};
