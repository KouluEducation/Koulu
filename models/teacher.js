'use strict';

module.exports = function (sequelize, DataTypes) {
    var Teacher = sequelize.define('Teacher', {
        user_id: {
            type: DataTypes.INTEGER,
            references: 'Users',
            referencesKey: 'id'
        }
    }, {
        classMethods: {
            associate: function (models) {
                Teacher.hasMany(models.Subject, { through: models.TeacherSubjects });
            }
        },
        instanceMethods: {
            /**
             * Associates a teacher to a subject
             * @param subject
             * @returns {Promise}
             */
            associateSubject: function (subject) {
                return this.addSubject(subject);
            },
            /**
             * Gets a teacher's subjects
             * @returns {Promise}
             */
            getClassroomsSubjects: function () {
                return sequelize.query(
                    'select s.id as id, c.id as classroom_id, concat(s.name, " (", c.name, ")") as name ' +
                    'from TeacherSubjects st ' +
                    'inner join Subjects s on st.subject_id = s.id ' +
                    'inner join Classrooms c on s.classroom_id = c.id ' +
                    'where st.teacher_id = ? ' +
                    'and st.deleted_at is null ' +
                    'and s.deleted_at is null ' +
                    'and c.deleted_at is null',
                    null, { raw: true }, [ this.id ]
                );
            }
        }
    });

    /* Static methods */

    /**
     * Creates an instance of Teacher
     * @param user
     * @returns {Promise}
     */
    Teacher.createOne = function (user) {
        return Teacher.create({}).then(function (teacher) {
            return user.setTeacher(teacher);
        });
    };

    return Teacher;
};
