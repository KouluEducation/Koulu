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
             */
            associateSubject: function (subject) {
                return this.addSubject(subject);
            },
            /**
             * Gets a teacher's subjects
             */
            getClassroomsSubjects: function () {
                return sequelize.query(
                    'select s.id as subject_id, c.id as classroom_id, concat(s.name, " (", c.name, ")") as name ' +
                    'from TeacherSubjects st ' +
                    'inner join Subjects s on st.subject_id = s.id ' +
                    'inner join Classrooms c on s.classroom_id = c.id ' +
                    'where teacher_id = ?',
                    null, { raw: true }, [ this.id ]
                );
            }
        }
    });

    return Teacher;
};
