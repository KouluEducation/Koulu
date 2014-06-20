'use strict';

var q = require('q');

module.exports = function (sequelize, DataTypes) {
    var Test = sequelize.define('Test', {
        description: DataTypes.STRING,
        date: DataTypes.DATE
    }, {
        classMethods: {
            associate: function (models) {
                Test.belongsTo(models.Subject.hasMany(Test));
            }
        },
        instanceMethods: {
        }
    });

    return Test;
};
