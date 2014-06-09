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
                    teacher.getSubjects().complete(function (err, subjects) {
                        res.render('home', {
                            user: user,
                            classrooms: subjects
                        });
                    });
                });
            } else {
                res.render('home', {
                    user: user
                });
            }
        });
    });

    router.get('/classrooms.json', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (user.isTeacher()) {
                user.getTeacher().complete(function (err, teacher) {
                    teacher.getSubjects().complete(function (err, subjects) {
                        res.json(subjects);
                    });
                });
            } else {
                res.json([]);
            }
        });
    });

};
