'use strict';

module.exports = function (sequelize, DataTypes) {
    var Subject = sequelize.define('Subject', {
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        classroom_id: {
            type: DataTypes.INTEGER,
            references: 'Classrooms',
            referencesKey: 'id'
        }
    }, {
        classMethods: {
            associate: function (models) {
                Subject
                    .belongsTo(models.Classroom)
                    .hasMany(models.Teacher, { through: models.TeacherSubjects })
                    .hasMany(models.Test);
            }
        },
        instanceMethods: {
            /**
             * Associates a classroom to a subject
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
     * Creates a subject
     * @param data
     * @returns {Promise}
     */
    Subject.createOne = function (data) {
        return Subject.findOrCreate({
            name: data.name,
            classroom_id: data.classroom_id
        });
    };

    return Subject;
};
