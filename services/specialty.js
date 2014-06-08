var q = require('q'),
    Specialty = require('../models').Specialty;

module.exports = {
    /**
     * Creates a specialty and associates it with a classroom if present
     * @param data
     * @param classroom
     */
    createSpecialty: function (data) {
        var deferred = q.defer();

        Specialty.findOrCreate({
            name: data.name
        }).success(function (specialty, created) {
            deferred.resolve(specialty);
        });

        return deferred.promise;
    }
};
