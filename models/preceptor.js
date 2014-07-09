'use strict';

module.exports = function (sequelize, DataTypes) {
    var Preceptor = sequelize.define('Preceptor', {
        user_id: {
            type: DataTypes.INTEGER,
            references: 'Users',
            referencesKey: 'id'
        }
    }, {
        classMethods: {
            associate: function (models) {
                Preceptor.hasMany(models.Classroom);
            }
        },
        instanceMethods: {
            /**
             * Associates a preceptor to a classroom
             * @param classroom
             */
            associateClassroom: function (classroom) {
                return classroom.setPreceptor(this);
            },
            /**
             * Gets a preceptor's classrooms
             */
            getClassrooms: function () {
                return sequelize.query(
                        'select id as classrom_id, name from Classrooms' +
                        'where preceptor_id = ? and deleted is null',
                    null, { raw: true }, [ this.id ]
                );
            }

        }
    });

    return Preceptor;
};
