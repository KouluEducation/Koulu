'use strict';

var models = require('../models'),
    User = models.User,
    Student = models.Student;

module.exports = function (router) {

    /**
     * Create a student
     */
    router.post('/', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('back');
            }
            var data = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                classroom_id: req.body.classroom,
                password: Math.floor((Math.random() * 999999) + 100000).toString(),
                kind: 'student'
            };
            User.build(data).save().then(function (user) {
                data.user = user;
                return Student.build(data).save();
            }).then(function (student) {
                return student.setUser(data.user);
            }).then(function () {
                // TODO: send a welcome email to the new student
                req.flash('success', data.first_name + ' ' + data.last_name + ' se ha agregado correctamente!');
                res.redirect('back');
            }).error(function () {
                req.flash('error', 'Error al agregar al alumno');
                res.redirect('back');
            });
        });
    });

    /**
     * Update a student
     */
    router.post('/:student_id', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('back');
            }
            Student.find(req.params.student_id).then(function (student) {
                student.classroom_id = req.body.classroom;
                return student.save();
            }).then(function (student) {
                return student.getUser();
            }).then(function (user) {
                user.first_name = req.body.first_name;
                user.last_name = req.body.last_name;
                user.email = req.body.email;
                return user.save();
            }).then(function (user) {
                req.flash('success', user.first_name + ' ' + user.last_name + ' se ha editado correctamente!');
                return res.redirect('back');
            }).error(function (err) {
                req.flash('error', 'Error al editar el alumno');
                res.redirect('back');
            });
        });
    });

    /**
     * Delete a student
     */
    router.post('/:student_id/delete', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('back');
            }
            Student.find(req.params.student_id).then(function (student) {
                return student.destroy();
            }).then(function (student) {
                return student.getUser();
            }).then(function (user) {
                return user.destroy();
            }).then(function (user) {
                req.flash('deleted', true);
                req.flash('success', user.first_name + ' ' + user.last_name + ' se ha eliminado correctamente!');
                return res.redirect('back');
            }).error(function () {
                req.flash('error', 'Error al eliminar el alumno');
                res.redirect('back');
            });
        });
    });

};