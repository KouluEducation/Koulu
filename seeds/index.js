'use strict';

var UserSeed = require('./user'),
    SpecialtySeed = require('./specialty'),
    ClassroomSeed = require('./classroom'),
    SubjectSeed = require('./subject');

module.exports = {

    executeSeeds: function () {

        var seededUsers = {},
            seededSpeciality = {},
            seededClassroom = {},
            seededSubject = {};

        return UserSeed.seed().then(function (users) {
            seededUsers = users;
            return SpecialtySeed.seed()
        }).then(function (specialty) {
            seededSpeciality = specialty;
            return ClassroomSeed.seed(specialty);
        }).then(function (classroom) {
            seededClassroom = classroom;
            return classroom.associateSpecialty(seededSpeciality);
        }).then(function (classroom) {
            return seededUsers.preceptor.associateClassroom(classroom);
        }).then(function (classroom) {
            return seededUsers.student.associateClassroom(classroom);
        }).then(function (classroom) {
            return SubjectSeed.seed(classroom);
        }).then(function (subject) {
            seededSubject = subject;
            return subject.associateClassroom(seededClassroom);
        }).then(function (classroom) {
            return seededUsers.teacher.associateSubject(seededSubject);
        });

    }

};
