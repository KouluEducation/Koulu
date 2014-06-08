'use strict';

module.exports = function (sequelize, DataTypes) {
    var Teacher = sequelize.define('Teacher', {}, {
        classMethods: {
            associate: function (models) {}
        }
    });

    return Teacher;
};
