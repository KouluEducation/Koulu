'use strict';

var q = require('q'),
    UserSeed = require('./user'),
    SpecialtySeed = require('./specialty'),
    ClassroomSeed = require('./classroom'),
    SubjectSeed = require('./subject');

module.exports = {

    executeSeeds: function () {

        var seededUsers = {},
            seededSpeciality = {},
            seededClassroom = {};

        return UserSeed.seed()
        .then(function (users) {
            seededUsers = users;
            return SpecialtySeed.seed()
        })
        .then(function (specialty) {
            seededSpeciality = specialty;
            return ClassroomSeed.seed(specialty);
        })
        .then(function (classroom) {
            seededClassroom = classroom;
            return classroom.associateSpecialty(seededSpeciality);
        })
        .then(function (classroom) {
            return seededUsers.preceptor.associateClassroom(classroom);
        })
        .then(function (classroom) {
            return seededUsers.student.associateClassroom(classroom);
        })
        .then(function (classroom) {
            return SubjectSeed.seed(classroom);
        })
        .then(function (subject) {
            return subject.associateClassroom(seededClassroom);
        });

    }

};
