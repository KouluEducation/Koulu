'use strict';

var q = require('q');

module.exports = function (sequelize, DataTypes) {
    var TeacherSubjects = sequelize.define('TeacherSubjects', {
        subject_id: {
            type: DataTypes.INTEGER,
            references: 'Subjects',
            referencesKey: 'id'
        },
        teacher_id: {
            type: DataTypes.INTEGER,
            references: 'Teachers',
            referencesKey: 'id'
        }
    }, {
        classMethods: {
            associate: function (models) {}
        },
        instanceMethods: {
        }
    });

    return TeacherSubjects;
};
