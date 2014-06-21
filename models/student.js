'use strict';

var q = require('q');

module.exports = function (sequelize, DataTypes) {
    var Student = sequelize.define('Student', {
        user_id: {
            type: DataTypes.INTEGER,
            references: 'Users',
            referencesKey: 'id'
        },
        classroom_id: {
            type: DataTypes.INTEGER,
            references: 'Classrooms',
            referencesKey: 'id'
        }
    }, {
        classMethods: {
            associate: function (models) {
                Student
                    .hasMany(models.Parent, { through: models.StudentParents })
                    .belongsTo(models.Classroom);
            }
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
