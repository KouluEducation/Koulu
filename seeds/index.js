'use strict';

var q = require('q'),
    UserSeed = require('./user'),
    SpecialtySeed = require('./specialty'),
    ClassroomSeed = require('./classroom');

module.exports = {

    executeSeeds: function () {
        var deferred = q.defer();

        UserSeed.seed().then(function (user) {
            SpecialtySeed.seed().then(function (specialty) {
                ClassroomSeed.seed(specialty, user).then(function (classroom) {
                    console.log('All seeds executed');
                    deferred.resolve();
                });
            });
        });

        return deferred.promise;
    }

};
