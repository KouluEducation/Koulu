'use strict';

module.exports = function (sequelize, DataTypes) {
    var Preceptor = sequelize.define('Preceptor', {}, {
        classMethods: {
            associate: function (models) {
                Preceptor.hasMany(models.Classroom.belongsTo(Preceptor));
            }
        }
    });

    return Preceptor;
};
