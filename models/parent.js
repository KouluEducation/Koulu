'use strict';

module.exports = function (sequelize, DataTypes) {
    var Parent = sequelize.define('Parent', {
        user_id: {
            type: DataTypes.INTEGER,
            references: 'Users',
            referencesKey: 'id'
        }
    }, {
        classMethods: {
            associate: function (models) {
                Parent.hasMany(models.Student, { through: models.StudentParents });
            }
        }
    });

    return Parent;
};
