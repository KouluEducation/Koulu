'use strict';

module.exports = function (sequelize, DataTypes) {
    var Attendance = sequelize.define('Attendance', {
        date: {
            type: DataTypes.DATE,
            validate: {
                isDate: true
            },
            set: function (value) {
                // Temporary fix
                if (typeof value === 'string') {
                    value += ' 12:00:00';
                } else {
                    value.setHours(12);
                    value.setMinutes(0);
                    value.setSeconds(0);
                }
                return this.setDataValue('date', value);
            }
        },
        student_id: {
            type: DataTypes.INTEGER,
            references: 'Students',
            referencesKey: 'id'
        },
        status: DataTypes.ENUM('present', 'absent','late')
    }, {
        classMethods: {
            associate: function (models) {
                Attendance
                    .hasOne(models.Student)
            }
        },
        instanceMethods: {
        }
    });

    /* Static methods */

    /**
     * Creates a classroom
     * @param data
     * @returns {Promise}
     */
    Attendance.createOne = function (data) {
        return Attendance.build({
            date: new Date(),
            student_id: data.student_id,
            status: data.status
        }).save();
    };

    return Attendance;
};
