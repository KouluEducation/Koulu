'use strict';

module.exports = function (sequelize, DataTypes) {
    var Classroom = sequelize.define('Classroom', {
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        category: DataTypes.ENUM('primary', 'secondary'),
        preceptor_id: {
            type: DataTypes.INTEGER,
            references: 'Preceptors',
            referencesKey: 'id'
        },
        specialty_id: {
            type: DataTypes.INTEGER,
            references: 'Specialties',
            referencesKey: 'id'
        }
    }, {
        classMethods: {
            associate: function (models) {
                Classroom
                    .hasMany(models.Subject)
                    .hasMany(models.Student)
                    .belongsTo(models.Preceptor);
            }
        },
        instanceMethods: {
            /**
             * Associates specialty to a classroom
             * @param specialty
             */
            associateSpecialty: function (specialty) {
                return this.setSpecialty(specialty);
            },
            getAllStudents: function () {
                return sequelize.query(
                        'select s.`id` as `student_id`, u.`id` as `user_id`, u.`first_name`, u.`last_name`, u.`email` ' +
                        'from Students s ' +
                        'inner join Users u on s.`user_id` = u.`id` ' +
                        'where s.`classroom_id` = ? ' +
                        'order by u.`last_name`, u.`first_name`',
                    null, { raw: true }, [ this.id ]
                );
            }
        }
    });

    return Classroom;
};
