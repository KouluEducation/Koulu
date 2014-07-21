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
             * Calculates Average Qualification
             * @param subject
             * @param start
             * @param end
             * @returns {Promise}
             */
            getAverageQualification: function (start, end, subject) {
                var query = 'select AVG(mark) as avg from Qualifications q ' +
                    'INNER JOIN Tests t ON t.id = q.test_id ' +
                    'where student_id = ? and t.date BETWEEN ? AND ?';
                var params = [ this.id, start, end ];
                if (subject) {
                    query += ' AND subject_id = ?';
                    params.push(subject);
                }
                query += ' GROUP BY q.student_id';
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
