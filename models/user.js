'use strict';

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        username:   DataTypes.STRING,
        password:   DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name:  DataTypes.STRING
    }, {
        classMethods:    {
            associate: function (models) {
                User.hasMany(models.Task)
            }
        },
        instanceMethods: {
            getNameUpperCase: function () {
                return this.username.toUpperCase();
            }
        }
    });

    return User;
};