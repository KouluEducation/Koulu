'use strict';

var UserSrv = require('../services/user');

module.exports = function (router) {

    /**
     * Index
     */
    router.get('/', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (user.isTeacher()) {
                user.getTeacher().complete(function (err, teacher) {
                    teacher.getClassroomsSubjects().then(function (classroomsSubjects) {
                        res.render('home_teacher', {
                            user: user,
                            classrooms: classroomsSubjects
                        });
                    });
                });
            } else {
                res.send('Ups! There is no home for your kind of user yet...');
            }
        });
    });

};