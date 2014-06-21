'use strict';

var UserSrv = require('../services/user'),
    models = require('../models'),
    Classroom = models.Classroom,
    Subject = models.Subject;

module.exports = function (router) {

    /**
     * Index
     */
    router.get('/new', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (!user.isTeacher()) {
                return res.redirect('back');
            }
            var data = {};
            Classroom.findAll().then(function (classrooms) {
                data.classrooms = classrooms;
                res.render('subject/form', data);
            });
        });
    });

    router.post('/', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (!user.isTeacher()) {
                return res.redirect('back');
            }
            Subject.build(req.body).save().then(function (subject) {
                return user.getTeacher().then(function (teacher) {
                    teacher.associateSubject(subject);
                });
            }).then(function () {
                res.redirect('back');
            });
        });
    });

};
