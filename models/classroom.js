'use strict';

module.exports = function (sequelize, DataTypes) {
    var Classroom = sequelize.define('Classroom', {
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        category: DataTypes.ENUM('primary', 'secondary')
    }, {
        classMethods: {
            associate: function (models) {
                Classroom
                    .hasMany(models.Teacher.hasMany(Classroom))
                    .hasMany(models.Student);
            }
        }
    });

    return Classroom;
};
