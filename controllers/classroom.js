'use strict';

var models = require('../models'),
    Classroom = models.Classroom,
    Specialty = models.Specialty,
    Subject = models.Subject,
    Student = models.Student,
    User = models.User;

module.exports = function (router) {

    /**
     * View to create a classroom
     */
    router.get('/new', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
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

    /**
     * View to create a student
     */
    router.get('/:classroom_id/student/new', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('back');
            }
            var data = {
                deleted: req.flash('deleted'),
                error: req.flash('error'),
                success: req.flash('success')
            };
            Classroom.find(req.params.classroom_id).then(function (classroom) {
                data.classroom = classroom;
                res.render('student/form', data);
            });
        });
    });

    /**
     * View to update a student
     */
    router.get('/:classroom_id/student/:student_id/edit', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('back');
            }
            var data = {
                deleted: req.flash('deleted'),
                error: req.flash('error'),
                success: req.flash('success')
            };
            Student.find({ where: { id: req.params.student_id }, include: [User, Classroom] }).then(function (student) {
                data.student = student;
                return res.render('student/form', data);
            });
        });
    });

    /**
     * Index view of a student (subject view)
     */
    router.get('/:classroom_id/subject/:subject_id/student/:student_id', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('back');
            }
            var data = {};
            Student.find({ where: { id: req.params.student_id }, include: [User, Classroom] }).then(function (student) {
                data.student = student;
                return Subject.find(req.params.subject_id);
            }).then(function (subject) {
                data.subject = subject;
                res.render('student/item_by_subject', data);
            });
        });
    });

    /**
     * Index view of a student (general view)
     */
    router.get('/:classroom_id/student/:student_id', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('back');
            }
            Student.find({ where: { id: req.params.student_id }, include: [User, Classroom] }).then(function (student) {
                res.render('student/item_by_classroom', {
                    student: student
                });
            });
        });
    });

    /**
     * Index view of a classroom
     */
    router.get('/:classroom_id', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor() && !user.isStudent()) {
                return res.redirect('back');
            }
            var data = {};
            Classroom.find(req.params.classroom_id).then(function (classroom) {
                data.classroom = classroom;
                return classroom.getAllStudents();
            }).then(function (students) {
                data.students = students;
                res.render('classroom/item', data);
            });
        });
    });

    /**
     * Create a classroom
     */
    router.post('/', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('/');
            }
            Classroom.createOne(req.body).then(function (classroom) {
                req.flash('success', classroom.name + ' se ha creado correctamente!');
                res.redirect('back');
            }).error(function () {
                req.flash('error', 'Error al crear el curso');
                res.redirect('back');
            });
        });
    });

};
