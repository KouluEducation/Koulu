'use strict';

var q = require('q'),
    UserSeed = require('./user'),
    ClassroomSeed = require('./classroom');

module.exports = {

    executeSeeds: function () {
        var deferred = q.defer();

        UserSeed.seed().then(function (user) {
            ClassroomSeed.seed(user).then(function (classroom) {
                console.log('All seeds executed');
                deferred.resolve();
            });
        });

        return deferred.promise;
    }

};
