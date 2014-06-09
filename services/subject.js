var q = require('q'),
    Subject = require('../models').Subject;

module.exports = {
    /**
     * Creates a subject and associates it with a classroom if present
     * @param data
     * @param classroom
     */
    createSubject: function (data, classroom) {
        var deferred = q.defer();

        Subject.findOrCreate({
            name: data.name
        }).success(function (subject, created) {
            deferred.resolve(subject);
        });

        return deferred.promise;
    }
};
