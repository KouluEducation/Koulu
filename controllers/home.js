'use strict';

var User = require('../models').User;

module.exports = function (router) {

    /**
     * Index
     */
    router.get('/', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (user.isTeacher()) {
                user.getTeacher().then(function (teacher) {
                    return teacher.getClassroomsSubjects();
                }).then(function (classroomsSubjects) {
                    res.render('home_teacher', {
                        user: user,
                        classrooms: classroomsSubjects
                    });
                });
            } else if (user.isPreceptor()) {
                user.getPreceptor().then(function (preceptor) {
                    return preceptor.getClassrooms();
                }).then(function (classrooms) {
                    res.render('home_preceptor', {
                        user: user,
                        classrooms: classrooms
                    });
                });
            } else {
                res.send('Ups! There is no home for your kind of user yet...');
            }
        });
    });

};