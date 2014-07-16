'use strict';

var models = require('../models'),
    User = models.User,
    Test = models.Test;

module.exports = function (router) {

    /**
     * Create a test
     */
    router.post('/', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher()) {
                return res.redirect('back');
            }
            var data = {
                description: req.body.description,
                date: req.body.date,
                subject_id: req.body.subject
            };
            Test.createOne(data).then(function (test) {
                req.flash('success', test.description + ' se ha creado correctamente!');
                res.redirect('back');
            }).error(function () {
                req.flash('error', 'Error al crear evaluación');
                res.redirect('back');
            });
        });
    });

    /**
     * Update a test
     */
    router.post('/:test_id', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher()) {
                return res.redirect('back');
            }
            Test.find(req.params.test_id).then(function (test) {
                test.description = req.body.description;
                test.date = req.body.date;
                return test.save();
            }).then(function (test) {
                req.flash('success', test.description + ' se ha editado correctamente!');
                return res.redirect('back');
            }).error(function () {
                req.flash('error', 'Error al editar evaluación');
                res.redirect('back');
            });
        });
    });

    /**
     * Delete a test
     */
    router.post('/:test_id/delete', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher()) {
                return res.redirect('back');
            }
            Test.find(req.params.test_id).then(function (test) {
                return test.destroy();
            }).then(function (test) {
                req.flash('deleted', true);
                req.flash('success', test.description + ' se ha eliminado correctamente!');
                return res.redirect('back');
            }).error(function () {
                req.flash('error', 'Error al eliminar evaluación');
                res.redirect('back');
            });
        });
    });

};