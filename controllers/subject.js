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
            var data = {
                error: req.flash('error'),
                success: req.flash('success')
            };
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
            var data = {
                name: req.body.name,
                classroom_id: req.body.classroom
            };
            Subject.build(data).save().then(function (subject) {
                return user.getTeacher().then(function (teacher) {
                    return teacher.associateSubject(subject);
                });
            }).then(function () {
                req.flash('success', data.name + ' se ha creado correctamente!');
                res.redirect('back');
            }).error(function () {
                req.flash('error', 'Error al crear la materia');
                res.redirect('back');
            });
        });
    });

};
