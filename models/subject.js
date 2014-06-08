'use strict';

module.exports = function (sequelize, DataTypes) {
    var Subject = sequelize.define('Subject', {
        name: {
            type: DataTypes.STRING,
            unique: true
        }
    }, {
        classMethods: {
            associate: function (models) {
                Subject.hasMany(models.Teacher.hasMany(Subject));
            }
        }
    });

    return Subject;
};
