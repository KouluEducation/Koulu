'use strict';

module.exports = function (sequelize, DataTypes) {
    var Specialty = sequelize.define('Specialty', {
        name: {
            type: DataTypes.STRING,
            unique: true
        }
    }, {
        classMethods: {
            associate: function (models) {
                Specialty.hasOne(models.Classroom.belongsTo(Specialty));
            }
        }
    });

    return Specialty;
};
