'use strict';

var UserSrv = require('../services/user'),
    models = require('../models'),
    Classroom = models.Classroom,
    Specialty = models.Specialty;

module.exports = function (router) {

    router.get('/new', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('back');
            }
            var data = {
                error: req.flash('error'),
                success: req.flash('success'),
                categories: [
                    {
                        key: 'primary',
                        name: 'Primaria'
                    },
                    {
                        key: 'secondary',
                        name: 'Secundaria'
                    }
                ]
            };
            Specialty.findAll().then(function (specialties) {
                data.specialties = specialties;
                res.render('classroom/form', data);
            });
        });
    });

    router.get('/:classroom_id', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor() && !user.isStudent()) {
                return res.redirect('back');
            }
            Classroom.find(req.params.classroom_id).then(function (classroom) {
                res.send('classroom: ' + classroom.name);
            });
        });
    });

    router.post('/', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('/');
            }
            Classroom.build(req.body).save().then(function (classroom) {
                req.flash('success', classroom.name + ' se ha creado correctamente!');
                res.redirect('back');
            }).error(function () {
                req.flash('error', 'Error al crear el curso');
                res.redirect('back');
            });
        });
    });

};
