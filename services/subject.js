var q = require('q'),
    Subject = require('../models').Subject;

module.exports = {
    /**
     * Creates a specialty and associates it with a classroom if present
     * @param data
     * @param classroom
     */
    createSubject: function (data) {
        var deferred = q.defer();

        Subject.findOrCreate({
            name: data.name
        }).success(function (specialty, created) {
            deferred.resolve(specialty);
        });

        return deferred.promise;
    }
};
