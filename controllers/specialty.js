'use strict';

var UserSrv = require('../services/user'),
    models = require('../models'),
    Specialty = models.Specialty;

module.exports = function (router) {

    /**
     * Index
     */
    router.get('/new', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('back');
            }
            var data = {
                error: req.flash('error'),
                success: req.flash('success')
            };
            res.render('specialty/form', data);
        });
    });

    router.post('/', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('/');
            }
            Specialty.build(req.body).save().then(function (specialty) {
                req.flash('success', specialty.name + ' se ha creado correctamente!');
                res.redirect('back');
            }).error(function () {
                req.flash('error', 'Error al crear la especialidad');
                res.redirect('back');
            });
        });
    });

};
