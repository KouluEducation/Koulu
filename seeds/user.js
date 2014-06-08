var q = require('q'),
    UserSrv = require('../services/user');

module.exports = {

    seed: function () {
        var deferred = q.defer();

        var data = {
            email: 'teacher@koulu.com',
            password: 'koulu',
            first_name: 'Profesor',
            last_name: 'Koulu',
            kind: 'teacher'
        };

        UserSrv.createUser(data, function (user) {
            console.log('User seed success');
            deferred.resolve(user);
        }, function (err) {
            console.error('User seed failed');
            deferred.reject(err);
        });

        return deferred.promise;
    }

};
