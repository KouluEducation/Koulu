'use strict';

var moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    var Test = sequelize.define('Test', {
        description: DataTypes.STRING,
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
        subject_id: {
            type: DataTypes.INTEGER,
            references: 'Subjects',
            referencesKey: 'id'
        }
    }, {
        classMethods: {
            associate: function (models) {
                Test
                    .hasOne(models.Qualification)
                    .belongsTo(models.Subject);
            }
        },
        instanceMethods: {
            /**
             * Gets the tests date in latin format
             * @returns {string}
             */
            getDateFormatted: function () {
                return moment(this.date).format('DD-MM-YYYY');
            },
            /**
             * Gets the tests date in database format
             * @returns {string}
             */
            getDateValue: function () {
                return moment(this.date).format('YYYY-MM-DD');
            },
            /**
             * Associates a test to a subject
             * @param subject
             * @returns {Promise}
             */
            associateSubject: function (subject) {
                return this.setSubject(subject);
            }
        }
    });

    /* Static methods */

    /**
     * Creates a test
     * @param data
     * @returns {Promise}
     */
    Test.createOne = function (data) {
        return Test.findOrCreate({
            description: data.description,
            date: data.date,
            subject_id: data.subject_id
        });
    };

    return Test;
};
