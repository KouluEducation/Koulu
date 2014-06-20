'use strict';

var q = require('q');

module.exports = function (sequelize, DataTypes) {
    var Qualification = sequelize.define('Qualification', {
        mark: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 10
            }
        },
        reviewed: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function (models) {
                Qualification.belongsTo(models.Test.hasOne(Qualification));
            }
        },
        instanceMethods: {
        }
    });

    return Qualification;
};
