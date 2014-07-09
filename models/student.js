'use strict';

module.exports = function (sequelize, DataTypes) {
    var Student = sequelize.define('Student', {
        user_id: {
            type: DataTypes.INTEGER,
            references: 'Users',
            referencesKey: 'id'
        },
        classroom_id: {
            type: DataTypes.INTEGER,
            references: 'Classrooms',
            referencesKey: 'id'
        }
    }, {
        classMethods: {
            associate: function (models) {
                Student
                    .hasMany(models.Parent, { through: models.StudentParents })
                    .belongsTo(models.Classroom);
            }
        },
        instanceMethods: {
            /**
             * Associates a student to a classroom
             * @param classroom
             */
            associateClassroom: function (classroom) {
                return this.setClassroom(classroom);
            }
        }
    });

    return Student;
};
