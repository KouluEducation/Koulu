var q = require('q'),
    SubjectSrv = require('../services/subject');

module.exports = {

    seed: function (classroom) {
        var deferred = q.defer();

        var data = {
            name: 'Laboratorio de Programación'
        };

        SubjectSrv.createSubject(data, classroom).then(function (subject) {
            console.error('Subject seed success');
            deferred.resolve(subject);
        }, function (err) {
            console.error('Subject seed failed');
            deferred.reject(err);
        });

        return deferred.promise;
    }

};
