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
            }
        }
    });

    return Test;
};
