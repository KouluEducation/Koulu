var q = require('q'),
    ClassroomSrv = require('../services/classroom');

module.exports = {

    seed: function () {
        var deferred = q.defer();

        var data = {
            name: '4to "C"',
            category: 'secondary'
        };

        ClassroomSrv.createClassroom(data).then(function (classroom) {
            console.error('Classroom seed success');
            deferred.resolve(classroom);
        }, function (err) {
            console.error('Classroom seed failed');
            deferred.reject(err);
        });

        return deferred.promise;
    }

};
