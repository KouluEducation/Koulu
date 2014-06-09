'use strict';

var q = require('q');

module.exports = function (sequelize, DataTypes) {
    var Preceptor = sequelize.define('Preceptor', {}, {
        classMethods: {
            associate: function (models) {
                Preceptor.hasMany(models.Classroom.belongsTo(Preceptor));
            }
        },
        instanceMethods: {
            /**
             * Associates a preceptor to a classroom
             * @param classroom
             */
            associateClassroom: function (classroom) {
                var deferred = q.defer();

                classroom.setPreceptor(this)
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

    return Preceptor;
};
