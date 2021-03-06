'use strict';

var models = require('../models'),
    User = models.User,
    Specialty = models.Specialty;

module.exports = function (router) {

    /**
     * Index
     */
    router.get('/new', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
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

    router.post('/', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('/');
            }
            Specialty.createOne(req.body).then(function (specialty) {
                req.flash('success', specialty.name + ' se ha creado correctamente!');
                res.redirect('back');
            }).error(function () {
                req.flash('error', 'Error al crear la especialidad');
                res.redirect('back');
            });
        });
    });

};