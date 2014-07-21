'use strict';

var models = require('../models'),
    User = models.User,
    Test = models.Test,
    Classroom = models.Classroom,
    Qualification = models.Qualification,
    Subject = models.Subject;

module.exports = function (router) {

    /**
     * View to create a subject
     */
    router.get('/new', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
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
    router.get('/:subject_id', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
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
    router.get('/:subject_id/edit', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
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
     * View to create a test
     */
    router.get('/:subject_id/test/new', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher()) {
                return res.redirect('back');
            }
            var data = {
                deleted: req.flash('deleted'),
                error: req.flash('error'),
                success: req.flash('success')
            };
            Subject.find({ where: { id: req.params.subject_id }, include: [Classroom] }).then(function (subject_with_classroom) {
                data.subject = subject_with_classroom;
                res.render('test/form', data);
            });
        });
    });

    /**
     * Index view of a test
     */
    router.get('/:subject_id/test/:test_id', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher()) {
                return res.redirect('back');
            }
            var data = {
                deleted: req.flash('deleted'),
                error: req.flash('error'),
                success: req.flash('success')
            };
            Subject.find({ where: { id: req.params.subject_id }, include: [Classroom] }).then(function (subject_with_classroom) {
                data.subject = subject_with_classroom;
                return Test.find(req.params.test_id);
            }).then(function (test) {
                data.test = test;
                return data.subject.classroom.getAllStudents();
            }).then(function (students) {
                data.students = students;
                res.render('test/item', data);
            })
        });
    });

    /**
     * View to update a test
     */
    router.get('/:subject_id/test/:test_id/edit', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher()) {
                return res.redirect('back');
            }
            var data = {
                deleted: req.flash('deleted'),
                error: req.flash('error'),
                success: req.flash('success')
            };
            Subject.find({ where: { id: req.params.subject_id }, include: [Classroom] }).then(function (subject_with_classroom) {
                data.subject = subject_with_classroom;
                return Test.find(req.params.test_id);
            }).then(function (test) {
                data.test = test;
                res.render('test/form', data);
            });
        });
    });


    /**
     * Post method to get Qualifications
     */
    router.post('/:subject_id/test/:test_id/edit', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher()) {
                return res.redirect('back');
            }

            delete req.body._csrf;
            var test_id = req.body.test;
            delete req.body.test;

            var qualifications = [];
            for (var key in req.body) {
                if (req.body.hasOwnProperty(key)) {
                    var id = key.split('-');
                    qualifications.push({student_id: id[1], mark: req.body[key], test_id: test_id});
                }
            }

            Qualification.destroy({ test_id: test_id }).then(function () {
                return Qualification.bulkCreate(qualifications);
            }).then(function () {
                req.flash('success', 'Se ha cargado la asistencia correctamente!');
                res.redirect('back');
            }).error(function () {
                req.flash('error', 'Error al cargar asistencia');
                res.redirect('back');
            });

        });
    });

    /**
     * Create a subject
     */
    router.post('/', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher()) {
                return res.redirect('back');
            }
            var data = {
                name: req.body.name,
                classroom_id: req.body.classroom
            };
            Subject.createOne(data).then(function (subject) {
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
    router.post('/:subject_id', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
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
    router.post('/:subject_id/delete', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
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