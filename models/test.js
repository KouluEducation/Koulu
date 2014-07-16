'use strict';

var moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    var Test = sequelize.define('Test', {
        description: DataTypes.STRING,
        date: DataTypes.DATE,
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
