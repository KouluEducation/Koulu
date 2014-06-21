'use strict';

var q = require('q');

module.exports = function (sequelize, DataTypes) {
    var Test = sequelize.define('Test', {
        description: DataTypes.STRING,
        date: DataTypes.DATE,
        subject_id: {
            type: DataTypes.INTEGER,
            references: 'Subjects',
            referencesKey: 'id'
        }
    }, {
        classMethods: {
            associate: function (models) {
                Test
                    .hasOne(models.Qualification)
                    .belongsTo(models.Subject);
            }
        },
        instanceMethods: {
        }
    });

    return Test;
};
