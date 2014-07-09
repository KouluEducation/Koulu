'use strict';

module.exports = function (sequelize, DataTypes) {
    var Qualification = sequelize.define('Qualification', {
        mark: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 10
            }
        },
        reviewed: DataTypes.BOOLEAN,
        test_id: {
            type: DataTypes.INTEGER,
            references: 'Tests',
            referencesKey: 'id'
        }
    }, {
        classMethods: {
            associate: function (models) {
                Qualification.belongsTo(models.Test);
            }
        },
        instanceMethods: {
        }
    });

    return Qualification;
};
