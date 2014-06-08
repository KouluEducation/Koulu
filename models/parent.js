'use strict';

module.exports = function (sequelize, DataTypes) {
    var Parent = sequelize.define('Parent', {}, {
        classMethods: {
            associate: function (models) {}
        }
    });

    return Parent;
};
