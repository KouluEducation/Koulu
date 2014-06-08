'use strict';

module.exports = function (sequelize, DataTypes) {
    var Student = sequelize.define('Student', {}, {
        classMethods: {
            associate: function (models) {}
        }
    });

    return Student;
};
