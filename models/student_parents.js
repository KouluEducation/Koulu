'use strict';

var q = require('q');

module.exports = function (sequelize, DataTypes) {
    var StudentParents = sequelize.define('StudentParents', {
        student_id: {
            type: DataTypes.INTEGER,
            references: 'Students',
            referencesKey: 'id'
        },
        parent_id: {
            type: DataTypes.INTEGER,
            references: 'Parents',
            referencesKey: 'id'
        }
    }, {
        classMethods: {
            associate: function (models) {}
        },
        instanceMethods: {
        }
    });

    return StudentParents;
};
