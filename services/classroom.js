var q = require('q'),
    models = require('../models'),
    Classroom = models.Classroom,
    Preceptor = models.Preceptor;

module.exports = {
    /**
     * Creates a classroom and associates it with its creator
     * @param data
     * @param user
     */
    createClassroom: function (data, specialty, user) {
        var deferred = q.defer();

        Classroom.build({
            name: data.name,
            category: data.category
        }).save().complete(function (err, classroom) {
            if (err) {
                deferred.reject(err);
            }
            q.all([
                associatePreceptor(classroom, user),
                associateSpecialty(classroom, specialty)
            ]).then(function () {
                deferred.resolve(classroom);
            });
        });

        return deferred.promise;
    }
};

/* ---- Private methods ---- */

/**
 * Associates user of kind Preceptor with a classroom
 * @param classroom
 * @param user
 */
var associatePreceptor = function (classroom, user) {
    var deferred = q.defer();

    if (user.isPreceptor()) {
        Preceptor.find({ where: { user_id: user.id } })
            .complete(function (err, preceptor) {
                if (err) {
                    return deferred.reject(err);
                }
                classroom.setPreceptor(preceptor).complete(function (err) {
                    if (err) {
                        return deferred.reject(err);
                    }
                    deferred.resolve(classroom);
                });
            });
    } else {
        deferred.resolve(classroom);
    }

    return deferred.promise;
};

/**
 * Associates specialty with a classroom
 * @param classroom
 * @param specialty
 */
var associateSpecialty = function (classroom, specialty) {
    var deferred = q.defer();

    if (specialty) {
        classroom.setSpecialty(specialty).complete(function (err, classroom) {
            if (err) {
                return deferred.reject(err);
            }
            deferred.resolve(classroom);
        });
    } else {
        deferred.resolve(classroom);
    }

    return deferred.promise;
};
