'use strict';

module.exports = function (sequelize, DataTypes) {
    var Specialty = sequelize.define('Specialty', {
        name: {
            type: DataTypes.STRING,
            unique: true
        }
    }, {
        classMethods: {
            associate: function (models) {
                Specialty.hasOne(models.Classroom.belongsTo(Specialty));
            }
        }
    });

    /* Static methods */

    /**
     * Creates a specialty
     * @param data
     * @returns {Promise}
     */
    Specialty.createOne = function (data) {
        return Specialty.findOrCreate({
            name: data.name
        });
    };

    return Specialty;
};
