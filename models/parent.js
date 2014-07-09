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

    /* Static methods */

    /**
     * Creates an instance of Parent
     * @param user
     * @returns {Promise}
     */
    Parent.createOne = function (user) {
        return Parent.create({}).then(function (parent) {
            return user.setParent(parent);
        });
    };

    return Parent;
};
