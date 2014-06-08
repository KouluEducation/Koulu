var q = require('q'),
    Specialty = require('../services/specialty');

module.exports = {

    seed: function () {
        var deferred = q.defer();

        var data = {
            name: 'Informática'
        };

        Specialty.createSpecialty(data).then(function (specialty) {
            console.error('Specialty seed success');
            deferred.resolve(specialty);
        }, function (err) {
            console.error('Specialty seed failed');
            deferred.reject(err);
        });

        return deferred.promise;
    }

};
