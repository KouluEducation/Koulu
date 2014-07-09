var q = require('q'),
    User = require('../models').User;

module.exports = {

    seed: function () {
        var deferred = q.defer();

        var teacher = {
            email: 'teacher@koulu.com',
            password: 'koulu',
            first_name: 'Profesor',
            last_name: 'Koulu',
            kind: 'teacher'
        };

        var preceptor = {
            email: 'preceptor@koulu.com',
            password: 'koulu',
            first_name: 'Preceptor',
            last_name: 'Koulu',
            kind: 'preceptor'
        };

        var student = {
            email: 'student@koulu.com',
            password: 'koulu',
            first_name: 'Estudiante',
            last_name: 'Koulu',
            kind: 'student'
        };

        var parent = {
            email: 'parent@koulu.com',
            password: 'koulu',
            first_name: 'Padre',
            last_name: 'Koulu',
            kind: 'parent'
        };

        q.all([
            User.createOne(teacher),
            User.createOne(preceptor),
            User.createOne(student),
            User.createOne(parent)
        ]).then(function (users) {
            deferred.resolve({
                teacher: users[0],
                preceptor: users[1],
                student: users[2],
                parent: users[3]
            });
        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    }

};
