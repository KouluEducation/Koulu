'use strict';

module.exports = function (sequelize, DataTypes) {
    var Teacher = sequelize.define('Teacher', {

    }, {
        classMethods: {
            associate: function(models) {
                Teacher.belongsTo(models.User)
            }
        }
    });

    return Teacher;
};