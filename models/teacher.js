'use strict';

var q = require('q');

module.exports = function (sequelize, DataTypes) {
    var Teacher = sequelize.define('Teacher', {}, {
        classMethods: {
            associate: function (models) {}
        },
        instanceMethods: {
            /**
             * Associates a teacher to a subject
             * @param subject
             */
            associateSubject: function (subject) {
                var deferred = q.defer();

                this.setSubjects([subject])
                    .complete(function (err) {
                        if (err) {
                            return deferred.reject(err);
                        }
                        deferred.resolve(subject);
                    });

                return deferred.promise;
            },
            /**
             * Gets a teacher's subjects
             */
            getClassroomsSubjects: function () {
                var deferred = q.defer();

                sequelize.query(
                    'select s.id as subject_id, c.id as classroom_id, concat(s.name, " (", c.name, ")") as name ' +
                    'from SubjectsTeachers st ' +
                    'inner join Subjects s on st.subject_id = s.id ' +
                    'inner join ClassroomsSubjects cs on s.id = cs.subject_id ' +
                    'inner join Classrooms c on cs.classroom_id = c.id ' +
                    'where teacher_id = ?',
                    null, { raw: true }, [ this.id ]
                ).success(function (classroomsSubjects) {
                    deferred.resolve(classroomsSubjects);
                });

                return deferred.promise;
            }
        }
    });

    return Teacher;
};
