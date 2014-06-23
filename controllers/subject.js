'use strict';

var UserSrv = require('../services/user'),
    models = require('../models'),
    Classroom = models.Classroom,
    Subject = models.Subject;

module.exports = function (router) {

    /**
     * View to create a subject
     */
    router.get('/new', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (!user.isTeacher()) {
                return res.redirect('back');
            }
            var data = {
                deleted: req.flash('deleted'),
                error: req.flash('error'),
                success: req.flash('success')
            };
            Classroom.findAll().then(function (classrooms) {
                data.classrooms = classrooms;
                res.render('subject/form', data);
            });
        });
    });

    /**
     * Index view of a subject
     */
    router.get('/:subject_id', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor() && !user.isStudent()) {
                return res.redirect('back');
            }
            var data = {};
            Subject.find(req.params.subject_id).then(function (subject) {
                data.subject = subject;
                return subject.getClassroom();
            }).then(function (classroom) {
                data.classroom = classroom;
                return classroom.getAllStudents();
            }).then(function (students) {
                data.students = students;
                return data.subject.getTests({order: 'date ASC'});
            }).then(function (tests) {
                data.tests = tests;
                res.render('subject/item', data);
            });
        });
    });

    /**
     * View to update a subject
     */
    router.get('/:subject_id/edit', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (!user.isTeacher()) {
                return res.redirect('back');
            }
            var data = {
                deleted: req.flash('deleted'),
                error: req.flash('error'),
                success: req.flash('success')
            };
            Subject.find(req.params.subject_id).then(function (subject) {
                data.subject = subject;
                return subject.getClassroom();
            }).then(function (classroom) {
                data.classroom = classroom;
                return Classroom.findAll();
            }).then(function (classrooms) {
                data.classrooms = classrooms;
                res.render('subject/form', data);
            });
        });
    });

    /**
     * Create a subject
     */
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

    /**
     * Update a subject
     */
    router.post('/:subject_id', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (!user.isTeacher()) {
                return res.redirect('back');
            }
            Subject.find(req.params.subject_id).then(function (subject) {
                subject.name = req.body.name;
                subject.classroom_id = req.body.classroom;
                return subject.save()
            }).then(function (subject) {
                req.flash('success', subject.name + ' se ha editado correctamente!');
                return res.redirect('back');
            }).error(function () {
                req.flash('error', 'Error al editar la materia');
                res.redirect('back');
            });
        });
    });

    /**
     * Delete a subject
     */
    router.post('/:subject_id/delete', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (!user.isTeacher()) {
                return res.redirect('back');
            }
            Subject.find(req.params.subject_id).then(function (subject) {
                return subject.destroy();
            }).then(function (subject) {
                req.flash('deleted', true);
                req.flash('success', subject.name + ' se ha eliminado correctamente!');
                return res.redirect('back');
            }).error(function () {
                req.flash('error', 'Error al eliminar la materia');
                res.redirect('back');
            });
        });
    });

};