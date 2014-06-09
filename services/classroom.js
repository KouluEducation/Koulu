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
    createClassroom: function (data) {
        var deferred = q.defer();

        Classroom.build({
            name: data.name,
            category: data.category
        }).save().complete(function (err, classroom) {
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(classroom);
        });

        return deferred.promise;
    }
};
