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
                    .belongsTo(models.Classroom)
                    .hasMany(models.Attendance)
                    .hasMany(models.Qualification);

            }
        },
        instanceMethods: {
            /**
             * Associates a student to a classroom
             * @param classroom
             * @returns {Promise}
             */
            associateClassroom: function (classroom) {
                return this.setClassroom(classroom);
            }
        }
    });

    /* Static methods */

    /**
     * Creates an instance of Student
     * @param user
     * @returns {Promise}
     */
    Student.createOne = function (user) {
        return Student.create({}).then(function (student) {
            return user.setStudent(student);
        });
    };

    return Student;
};
