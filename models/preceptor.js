'use strict';

module.exports = function (sequelize, DataTypes) {
    var Preceptor = sequelize.define('Preceptor', {

    }, {
        classMethods: {
            associate: function(models) {
                Preceptor.belongsTo(models.User)
            }
        }
    });

    return Preceptor;
};