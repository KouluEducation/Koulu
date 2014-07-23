'use strict';

var models = require('../models'),
    Classroom = models.Classroom,
    Specialty = models.Specialty,
    Subject = models.Subject,
    Student = models.Student,
    Attendance = models.Attendance,
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
            if (!user.isTeacher() && !user.isPreceptor() && !user.isStudent()) {
                return res.redirect('back');
            }
            var data = {};
            data.user = user;
            Student.find({ where: { id: req.params.student_id }, include: [User, Classroom] }).then(function (student) {
                data.student = student;
                return Subject.find(req.params.subject_id);
            }).then(function (subject) {
                data.subject = subject;
                var start = new Date();
                start.setMonth(2);
                start.setDate(1);
                var end = new Date();
                end.setMonth(4);
                end.setDate(31);
                return data.student.getAverageQualification(start, end, data.subject.id);
            }).then(function (first) {
                data.first = first;
                var start = new Date();
                start.setMonth(5);
                start.setDate(1);
                var end = new Date();
                end.setMonth(7);
                end.setDate(31);
                return data.student.getAverageQualification(start, end, data.subject.id);
            }).then(function (second) {
                data.second = second;
                var start = new Date();
                start.setMonth(8);
                start.setDate(1);
                var end = new Date();
                end.setMonth(10);
                end.setDate(30);
                return data.student.getAverageQualification(start, end, data.subject.id);
            }).then(function (third) {
                data.third = third;
                return data.student.getTestsQualifications(data.subject.id);
            }).then(function (qualifications) {
                console.log(JSON.stringify(qualifications));
                data.qualifications = qualifications;
                res.render('student/item_by_subject', data);
            });
        });
    });

    /**
     * Index view of a student (classroom view)
     */
    router.get('/:classroom_id/student/:student_id', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('back');
            }
            var data = {};
            var start = new Date();
            start.setMonth(0);
            start.setDate(1);
            var end = new Date();
            end.setMonth(11);
            end.setDate(31);
            Student.find({ where: { id: req.params.student_id }, include: [ User, Classroom ] }).then(function (student) {
                data.student = student;
                return data.student.getAverageQualification(start, end);
            }).then(function (average) {
                data.average = average;
                return data.student.getTotalAbsences(start, end);
            }).then(function (total_absences) {
                data.total_absences = total_absences;
                return data.student.getAbsences(start, end);
            }).then(function (absences) {
                data.absences = absences;
                return data.student.getTestsQualifications();
            }).then(function (qualifications) {
                data.qualifications = qualifications;
                res.render('student/item_by_classroom', data);
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
            var data = {
                deleted: req.flash('deleted'),
                error: req.flash('error'),
                success: req.flash('success')
            };
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
                if (user.isPreceptor()) {
                    return user.getPreceptor().then(function (preceptor) {
                        return preceptor.addClassroom(classroom);
                    });
                }
                return classroom;
            }).then(function (classroom) {
                req.flash('success', classroom.name + ' se ha creado correctamente!');
                res.redirect('back');
            }).error(function () {
                req.flash('error', 'Error al crear el curso');
                res.redirect('back');
            });
        });
    });

    /**
     * View to take attendance
     */
    router.get('/:classroom_id/attendance', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('back');
            }

            var data = {
                error: req.flash('error'),
                success: req.flash('success')
            };

            Classroom.find(req.params.classroom_id).then(function (classroom) {
                data.classroom = classroom;
                return classroom.getAllStudents();
            }).then(function (students) {
                data.students = students;
                res.render('classroom/attendance', data);
            });
        });
    });

    /**
     * Post to set attendance
     */
    router.post('/:classroom_id/attendance', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('back');
            }
            delete req.body._csrf;
            var attendances = [];
            for (var key in req.body) {
                if (req.body.hasOwnProperty(key)) {
                    var id = key.split('-');
                    attendances.push({student_id: id[1], date: new Date(), status: req.body[key]});
                }
            }
            Attendance.bulkCreate(attendances).success(function () {
                req.flash('success', 'Se ha cargado la asistencia correctamente!');
                res.redirect('back');
            }).error(function () {
                req.flash('error', 'Error al cargar asistencia');
                res.redirect('back');
            });
        });
    });

    /**
     * Delete a classroom
     */
    router.post('/:classroom_id/delete', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('back');
            }
            Classrrom.find(req.params.classroom_id).then(function (classroom) {
                return classroom.destroy;
            }).then(function (classroom) {
                req.flash('deleted', true);
                req.flash('success', classroom.name + ' se ha eliminado correctamente!');
                return res.direct('back');
            }).error(function () {
                req.flash('error', 'Error al eliminar curso');
                res.redirect('back');
            });
        });
    });

};
