'use strict';

var q = require('q');

module.exports = function (sequelize, DataTypes) {
    var Classroom = sequelize.define('Classroom', {
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        category: DataTypes.ENUM('primary', 'secondary'),
        preceptor_id: {
            type: DataTypes.INTEGER,
            references: 'Preceptors',
            referencesKey: 'id'
        },
        specialty_id: {
            type: DataTypes.INTEGER,
            references: 'Specialties',
            referencesKey: 'id'
        }
    }, {
        classMethods: {
            associate: function (models) {
                Classroom
                    .hasMany(models.Subject)
                    .hasMany(models.Student)
                    .belongsTo(models.Preceptor);
            }
        },
        instanceMethods: {
            /**
             * Associates specialty to a classroom
             * @param specialty
             */
            associateSpecialty: function (specialty) {
                var deferred = q.defer();

                this.setSpecialty(specialty).complete(function (err, classroom) {
                    if (err) {
                        return deferred.reject(err);
                    }
                    deferred.resolve(classroom);
                });

                return deferred.promise;
            }
        }
    });

    return Classroom;
};
