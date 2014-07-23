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
            },
            /**
             * Retrieves the total amount of absences
             * @param {Date} start
             * @param {Date} end
             * @returns {Promise}
             */
            getTotalAbsences: function (start, end) {
                var query = 'select a.status, count(a.status) as count ' +
                    'from Attendances a ' +
                    'where a.student_id = ? ' +
                    'and a.date between ? and ? ' +
                    'group by a.status';
                return sequelize.query(query, null, { raw: true }, [ this.id, start, end ]).then(function (res) {
                    var absences = 0;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].status === 'absent') {
                            absences += res[i].count;
                        } else if (res[i].status === 'late') {
                            absences += (res[i].count * 0.5);
                        }
                    }
                    return absences;
                });
            },
            /**
             * Retrieves all absences and lates
             * @param {Date} start
             * @param {Date} end
             * @returns {Promise}
             */
            getAbsences: function (start, end) {
                return this.getAttendances({
                    where: {
                        date: {
                            between: [ start, end ]
                        }
                    },
                    order: 'date ASC'
                }).then(function (res) {
                    return res.filter(function (val) {
                        return val.status !== 'present';
                    });
                });
            },
            /**
             * Retrieves all the qualifications for a student
             * @param {number} [subject=]
             * @returns {Promise}
             */
            getTestsQualifications: function (subject) {
                var Test = require('../models').Test;
                var params = { include: [ Test ], order: 'date ASC' };
                if (subject) {
                    params.where = { subject_id: subject };
                }
                return this.getQualifications(params);
            },
            /**
             * Calculates average qualifications for a student
             * @param {Date} start
             * @param {Date} end
             * @param {number} [subject=]
             * @returns {Promise}
             */
            getAverageQualification: function (start, end, subject) {
                var query = 'select avg(mark) as avg from Qualifications q ' +
                    'inner join Tests t ON t.id = q.test_id ' +
                    'where student_id = ? and t.date between ? and ?';
                var params = [ this.id, start, end ];
                if (subject) {
                    query += ' and subject_id = ?';
                    params.push(subject);
                }
                query += ' group by q.student_id';
                return sequelize.query(query, null, { raw: true }, params).then(function (res) {
                    return res.length === 0 ? "N/A" : res[0].avg;
                });
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
